import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionInvoice } from '../entites/transaction-invoice.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Patient } from '../entites/patient.entity';
import { User } from '../entites/user.entity';
import { HelperService } from '../helper/helper.service';
import { Label } from '../entites/label.entity';
import { Medicine } from '../entites/medicine.entity';
import { ClinicService } from '../entites/clinic-service.entity';
import { TransactionInvoiceService } from '../entites/transaction-invoice-service.entity';
import { join } from 'path';
import { ClinicDocumentSetting } from 'src/entites/clinic-document-setting.entity';
import * as moment from 'moment';
import { renderFile } from 'ejs';
import { parseTemplateContent } from '../utils/template.util';
import { I18nService } from 'nestjs-i18n';
import { PdfService } from '../shared/pdf/pdf.service';
import { TransactionInvoiceReceipt } from 'src/entites/transaction-invoice-receipt.entity';
import { PAYMENT_TYPE_VALUE } from '../constants/payment.constant';
import { QueryParamsDto } from '../shared/dto/query-params.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionInvoice)
    private readonly transactionRepo: Repository<TransactionInvoice>,
    @InjectRepository(TransactionInvoiceService)
    private readonly transactionServiceRepo: Repository<TransactionInvoiceService>,
    @InjectRepository(TransactionInvoiceReceipt)
    private readonly transactionReceiptRepo: Repository<TransactionInvoiceReceipt>,
    @InjectRepository(ClinicDocumentSetting)
    private readonly clinicDocumentRepo: Repository<ClinicDocumentSetting>,
    @InjectRepository(Label)
    private readonly labelCateRepo: Repository<Label>,
    @InjectRepository(Medicine)
    private readonly medicineRepo: Repository<Medicine>,
    @InjectRepository(ClinicService)
    private readonly clinicServiceRepo: Repository<ClinicService>,
    private helpService: HelperService,
    private i18n: I18nService,
    private pdfService: PdfService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const savedTransaction = await this.transactionRepo.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        const transaction = this.transactionRepo.create(createTransactionDto);
        const savedTransaction =
          await transactionalEntityManager.save(transaction);

        const transactionPromises = createTransactionDto.services.map(
          (serviceDTO) => {
            const transactionService = this.transactionServiceRepo.create({
              ...serviceDTO,
              transaction_invoice_id: savedTransaction.id,
            });
            return transactionalEntityManager.save(transactionService);
          },
        );

        await Promise.all(transactionPromises);

        return savedTransaction;
      },
    );

    if (savedTransaction.status) {
      await this.generateReceipt(savedTransaction.id);
    }
  }

  async findAll(query: QueryParamsDto) {
    const take =
      !isNaN(Number(query.limit)) && Number(query.limit) > 0
        ? Number(query.limit)
        : 10;
    const page =
      !isNaN(Number(query.page)) && Number(query.page) > 0
        ? Number(query.page)
        : 1;
    const skip = (page - 1) * take;

    const qb = this.transactionRepo.createQueryBuilder('transaction_invoice');

    // Join doctor with user
    qb.leftJoinAndMapOne(
      'transaction_invoice.patient',
      Patient,
      'patient',
      'transaction_invoice.user_id = patient.id',
    );

    // Join user with user_clinics
    qb.leftJoinAndMapOne(
      'patient.user',
      User,
      'user',
      'patient.user_id = user.id',
    );

    qb.select([
      'transaction_invoice.id',
      'transaction_invoice.invoice_number',
      'transaction_invoice.net_amount',
      'transaction_invoice.bill_date',
      'transaction_invoice.status',
      'transaction_invoice.payment_type',
      'user.email',
      'user.image_url',
      `CONCAT(user.first_name, ' ', user.last_name) as full_name`,
    ]);

    // Search functionality
    if (query.search) {
      qb.andWhere(
        `CONCAT(user.first_name, ' ', user.last_name) LIKE :search OR user.email LIKE :search OR transaction_invoice.invoice_number LIKE :search`,
        { search: `%${query.search}%` },
      );
    }

    // Filter by clinic_id (user_clinics.clinic_id)
    if (query.clinic_id) {
      qb.andWhere('transaction_invoice.clinic_id = :clinic_id', {
        clinic_id: query.clinic_id,
      });
    }

    // Filter by user status
    if (query.status) {
      qb.andWhere('transaction_invoice.status = :status', {
        status: query.status,
      });
    }

    if (query.start_date) {
      qb.andWhere('transaction_invoice.created_at >= :startDate', {
        startDate: `${query.start_date} 00:00:00`,
      });
    }

    if (query.end_date) {
      qb.andWhere('transaction_invoice.created_at <= :endDate', {
        endDate: `${query.end_date} 23:59:59`,
      });
    }

    // Order by logic (can also order by concatenated full_name)
    const orderableFieldsMap = {
      full_name: "CONCAT(user.first_name, ' ', user.last_name)",
      transaction_invoice_invoice_number: 'transaction_invoice.invoice_number',
      bill_date: 'transaction_invoice.bill_date',
      net_amount: 'transaction_invoice.net_amount',
    };

    const orderByField: string =
      query.orderBy && orderableFieldsMap[query.orderBy]
        ? orderableFieldsMap[query.orderBy]
        : 'transaction_invoice.id'; // Default to doctor.id if no valid orderBy is provided

    const orderDirection: string =
      query.order && ['ASC', 'DESC'].includes(query.order.toUpperCase())
        ? query.order.toUpperCase()
        : 'DESC';

    qb.orderBy(orderByField, orderDirection as 'ASC' | 'DESC');

    // Apply pagination
    qb.skip(skip).take(take);

    // Fetch the results and total count
    const data = await qb.getRawMany();
    const total = await qb.getCount();

    return {
      data,
      pagination: {
        page,
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async findOne(id: number) {
    const data = await this.transactionRepo.findOne({
      where: {
        id,
      },
      relations: ['services', 'medical_certificate', 'receipt'],
    });

    if (!data) {
      return {
        data: {
          invoice_number: await this.generateInvoiceNumber(),
        },
      };
    }

    return {
      data,
    };
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const updatedTransaction = await this.transactionRepo.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        // Find the transaction to update
        const transaction = await this.transactionRepo.findOne({
          where: { id },
          relations: ['services'],
        });

        if (!transaction) {
          throw new Error('Transaction not found');
        }

        // Update the transaction fields (if any)
        Object.assign(transaction, updateTransactionDto);
        const updatedTransaction =
          await transactionalEntityManager.save(transaction);

        // First, handle removing old services that are no longer in the update DTO
        const existingServiceIds =
          updateTransactionDto.services
            ?.map((service) => service.id)
            .filter((id) => id !== null) || [];
        const servicesToRemove = transaction.services.filter(
          (service) =>
            !existingServiceIds.includes(service.id) && service.id !== null,
        );

        // Remove old services
        await transactionalEntityManager.remove(servicesToRemove);

        // Now, handle creating and updating services
        const transactionPromises = (updateTransactionDto.services || []).map(
          (serviceDTO) => {
            if (serviceDTO.id) {
              // If the service has an ID, we update it
              const existingService = transaction.services.find(
                (service) => service.id === serviceDTO.id,
              );
              if (existingService) {
                // Clone the existing service into a proper entity
                const updatedService = this.transactionServiceRepo.create({
                  ...existingService,
                  ...serviceDTO,
                });
                return transactionalEntityManager.save(updatedService);
              }
            } else {
              // If no ID, create a new service
              const newService = this.transactionServiceRepo.create({
                ...serviceDTO,
                transaction_invoice_id: id,
              });

              return transactionalEntityManager.save(newService);
            }
          },
        );

        // Wait for all promises (service creation/update) to finish
        await Promise.all(transactionPromises);
        return updatedTransaction;
      },
    );

    if (updatedTransaction.status) {
      await this.generateReceipt(updatedTransaction.id);
    }
  }

  async remove(id: number) {
    await this.transactionRepo.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        const transaction = await transactionalEntityManager.findOne(
          TransactionInvoice,
          {
            where: { id },
            relations: ['services', 'receipt'],
          },
        );

        if (!transaction) {
          throw new Error('Transaction record not found');
        }

        if (transaction.services.length > 0) {
          await transactionalEntityManager.delete(TransactionInvoiceService, {
            transaction_invoice_id: id,
          });
        }

        if (transaction.receipt) {
          await transactionalEntityManager.delete(TransactionInvoiceReceipt, {
            transaction_invoice_id: id,
          });
        }

        await transactionalEntityManager.delete(TransactionInvoice, id);
      },
    );
  }

  async getAllSelect(clinicId: number) {
    const doctors = await this.helpService.clinicDoctor(clinicId);
    const patients = await this.helpService.clinicPatient(clinicId);
    const paymentTypes = await this.helpService.getPaymentGateways(clinicId);
    const medicines = await this.medicineRepo.find({
      where: {
        active: true,
        clinic_id: clinicId,
      },
    });

    const clinicServices = await this.clinicServiceRepo.find({
      where: {
        active: 1,
        clinic_id: clinicId,
      },
    });

    const frequencies: any[] = [];
    const purposes: any[] = [];

    const labels = await this.labelCateRepo.findBy({ clinic_id: clinicId });
    labels.forEach((label) => {
      if (label.type === 2) {
        frequencies.push({ label: label.name, value: label.name });
      }
      if (label.type === 3) {
        purposes.push({ label: label.name, value: label.name });
      }
    });

    return {
      doctors,
      patients,
      payment_types: paymentTypes,
      frequencies,
      purposes,
      medicines,
      clinic_services: clinicServices,
    };
  }

  async getTransactionService(transactionInvoiceId: number) {
    const transaction = await this.transactionRepo.findOne({
      where: {
        id: transactionInvoiceId,
      },
      relations: ['patient', 'patient.user', 'patient.user.clinic', 'services'],
    });

    return {
      data: transaction,
    };
  }

  async getHistory(patientId: number) {
    const transaction = await this.transactionRepo.find({
      where: {
        user_id: patientId,
      },
      relations: ['doctor', 'doctor.user'],
    });

    return {
      data: transaction,
    };
  }

  async generateReceipt(transactionId: number) {
    const transaction = await this.transactionRepo.findOne({
      where: { id: transactionId },
      relations: ['services', 'receipt'],
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.receipt) {
      return transaction.receipt;
    }

    let totalServiceAmount = 0;
    let totalInventoryAmount = 0;

    const services = transaction.services;

    services.forEach((service) => {
      if (service.type === 'Inventories') {
        totalInventoryAmount += service.sub_total;
      }

      if (service.type === 'Services') {
        totalServiceAmount += service.sub_total;
      }
    });

    const invoiceNumber = await this.generateTransactionInvoice();
    const receipt = this.transactionReceiptRepo.create({
      transaction_invoice_id: transaction.id,
      receipt_number: invoiceNumber,
      service_amount: totalServiceAmount,
      inventory_amount: totalInventoryAmount,
      amount: transaction.net_amount,
    });

    return await this.transactionReceiptRepo.save(receipt);
  }

  async generateInvoiceNumber() {
    const lastPatient = await this.transactionRepo
      .createQueryBuilder('transaction_invoice')
      .orderBy('transaction_invoice.invoice_number', 'DESC')
      .limit(1)
      .getOne();

    let nextNumber: string;
    if (lastPatient) {
      const lastMRN = parseInt(lastPatient.invoice_number, 10);
      nextNumber = (lastMRN + 1).toString().padStart(6, '0');
    } else {
      nextNumber = '000001';
    }

    return nextNumber;
  }

  async generateTransactionInvoice(): Promise<string> {
    const count = await this.transactionReceiptRepo.count();

    let nextNumber: string;
    if (count > 0) {
      nextNumber = (count + 1).toString().padStart(5, '0');
    } else {
      nextNumber = '00001';
    }

    return nextNumber;
  }

  async exportInvoice(id: number) {
    const templatePath = join(
      __dirname,
      '..',
      'templates',
      'transaction-invoice.ejs',
    );
    const transactionInvoice = await this.transactionRepo.findOne({
      where: {
        id,
      },
      relations: [
        'services',
        'patient',
        'patient.user',
        'doctor',
        'doctor.user',
      ],
    });

    if (!transactionInvoice) {
      throw new NotFoundException('Certificate not found');
    }

    const clinicSetting = await this.clinicDocumentRepo.findOneBy({
      clinic_id: transactionInvoice.clinic_id,
    });
    if (!clinicSetting) {
      throw new NotFoundException('Clinic Setting not found');
    }

    const templateData = {
      patient_name: `${transactionInvoice.patient.user.first_name} ${transactionInvoice.patient.user.last_name}`,
      invoice_number: transactionInvoice.invoice_number,
      invoice_date: moment(transactionInvoice.bill_date).format('DD/MM/YYYY'),
      id_number: transactionInvoice.patient.user.id_number ?? 'N/A',
      patient_dob: transactionInvoice.patient.user.dob,
      patient_address: 'Address',
    };

    let body = clinicSetting.transaction_invoice_template;
    body = parseTemplateContent(body, templateData);

    const htmlContent: string = await renderFile(templatePath, {
      title: this.i18n.t('main.messages.transaction.invoice'),
      header: clinicSetting.header,
      countryCode: await this.helpService.getCurrencyCode(
        transactionInvoice.clinic_id,
      ),
      transactionInvoice,
      paymentType: transactionInvoice.payment_type,
      __: this.i18n.t.bind(this.i18n),
      body,
    });

    const pdfBuffer = await this.pdfService.createPdfFromHtml(htmlContent);
    return pdfBuffer;
  }

  async exportReceipt(id: number) {
    const templatePath = join(
      __dirname,
      '..',
      'templates',
      'transaction-receipt.ejs',
    );
    const transactionInvoice = await this.transactionRepo.findOne({
      where: {
        id,
      },
      relations: ['receipt', 'patient', 'patient.user'],
    });

    if (!transactionInvoice) {
      throw new NotFoundException('Certificate not found');
    }

    const clinicSetting = await this.clinicDocumentRepo.findOneBy({
      clinic_id: transactionInvoice.clinic_id,
    });
    if (!clinicSetting) {
      throw new NotFoundException('Clinic Setting not found');
    }

    const countryCode = await this.helpService.getCurrencyCode(
      transactionInvoice.clinic_id,
    );
    const receipt = transactionInvoice.receipt;
    const receiptAt = moment(receipt.created_at).format('DD/MM/YYYY');

    const templateData = {
      patient_name: `${transactionInvoice.patient.user.first_name} ${transactionInvoice.patient.user.last_name}`,
      invoice_number: transactionInvoice.invoice_number,
      invoice_date: moment(transactionInvoice.bill_date).format('DD/MM/YYYY'),
      id_number: transactionInvoice.patient.user.id_number ?? 'N/A',
      payment_method: transactionInvoice.payment_type
        ? PAYMENT_TYPE_VALUE[transactionInvoice.payment_type]
        : 'N/A',
      total_amount: receipt
        ? `${countryCode} ${receipt.amount.toFixed(2)}`
        : 'N/A',
      service_amount: receipt
        ? `${countryCode} ${receipt.service_amount.toFixed(2)}`
        : 'N/A',
      inventory_amount: receipt
        ? `${countryCode} ${receipt.inventory_amount.toFixed(2)}`
        : 'N/A',
    };

    let body = clinicSetting.transaction_receipt_template;
    body = parseTemplateContent(body, templateData);

    const htmlContent: string = await renderFile(templatePath, {
      header: clinicSetting.header,
      receipt,
      receiptAt,
      __: this.i18n.t.bind(this.i18n),
      body,
    });

    const pdfBuffer = await this.pdfService.createPdfFromHtml(htmlContent);
    return pdfBuffer;
  }
}
