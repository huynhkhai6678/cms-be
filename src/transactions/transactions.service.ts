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
import * as ejs from 'ejs';
import { parseTemplateContent } from '../utils/template.util';
import { I18nService } from 'nestjs-i18n';
import { PdfService } from '../shared/pdf/pdf.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionInvoice)
    private readonly transactionRepo: Repository<TransactionInvoice>,
    @InjectRepository(TransactionInvoiceService)
    private readonly transactionServiceRepo: Repository<TransactionInvoiceService>,
    @InjectRepository(ClinicDocumentSetting)
    private readonly clinicDocumentRepo: Repository<ClinicDocumentSetting>,
    @InjectRepository(Label)
    private readonly labelCateRepo: Repository<Label>,
    @InjectRepository(Medicine)
    private readonly medicineRepo: Repository<Medicine>,
    @InjectRepository(ClinicService)
    private readonly clinicServiceRepo: Repository<ClinicService>,
    private helpService: HelperService,
    private i18n : I18nService,
    private pdfService: PdfService
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    return await this.transactionRepo.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        // 1. Create PurchaseMedicine record
        const transaction = this.transactionRepo.create(createTransactionDto);
        const savedTransaction = await transactionalEntityManager.save(transaction);

        // 2. Create PurchasedMedicines records and associate with the created PurchaseMedicine
        const transactionPromises = createTransactionDto.services.map((serviceDTO) => {
          const transactionService = this.transactionServiceRepo.create({
            ...serviceDTO,
            transaction_invoice_id: savedTransaction.id,
          });
          return transactionalEntityManager.save(transactionService);
        });

        await Promise.all(transactionPromises);
        return savedTransaction;
      }
    );
  }

  async findAll(query) {
    const take = !isNaN(Number(query.limit)) && Number(query.limit) > 0 ? Number(query.limit) : 10;
    const page = !isNaN(Number(query.page)) && Number(query.page) > 0 ? Number(query.page) : 1;
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
      qb.andWhere('transaction_invoice.clinic_id = :clinic_id', { clinic_id: query.clinic_id });
    }

    // Filter by user status
    if (query.status) {
      qb.andWhere('transaction_invoice.status = :status', { status: query.status });
    }

    if (query.start_date) {
      qb.andWhere('transaction_invoice.created_at >= :startDate', { startDate: `${query.start_date} 00:00:00` });
    }

    if (query.end_date) {
      qb.andWhere('transaction_invoice.created_at <= :endDate', { endDate: `${query.end_date} 23:59:59` });
    }

    // Order by logic (can also order by concatenated full_name)
    const orderableFieldsMap = {
      full_name: "CONCAT(user.first_name, ' ', user.last_name)",
      transaction_invoice_invoice_number: "transaction_invoice.invoice_number",
      bill_date: "transaction_invoice.bill_date",
      net_amount: "transaction_invoice.net_amount",
    };

    const orderByField =
      query.orderBy && orderableFieldsMap[query.orderBy]
        ? orderableFieldsMap[query.orderBy]
        : 'transaction_invoice.id'; // Default to doctor.id if no valid orderBy is provided

    const orderDirection =
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
      where : {
        id
      },
      relations: ['services', 'medical_certificate']
    });

    if (!data) {
      return {
        data : {
          invoice_number : await this.generateInvoiceNumber()
        }
      }
    }

    return {
      data
    }
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  async remove(id: number) {
    await this.transactionRepo.manager.transaction(async (transactionalEntityManager: EntityManager) => {
        const transaction = await transactionalEntityManager.findOne(TransactionInvoice, {
          where: { id },
          relations: ['services'],
        });
  
        if (!transaction) {
          throw new Error('Transaction record not found');
        }
  
        if (transaction.services.length > 0) {
          await transactionalEntityManager.delete(TransactionInvoiceService, {
            transaction_invoice_id: id,
          });
        }
        await transactionalEntityManager.delete(TransactionInvoice, id);
    });
  }

  async getAllSelect(clinicId : number) {
    const doctors = await this.helpService.clinicDoctor(clinicId);
    const patients = await this.helpService.clinicPatient(clinicId);
    const paymentTypes = await this.helpService.getPaymentGateways(clinicId);
    const medicines = await this.medicineRepo.find({
      where : {
        active : true,
        clinic_id: clinicId
      }
    });

    const clinicServices = await this.clinicServiceRepo.find({
      where : {
        active : 1,
        clinic_id: clinicId
      }
    });

    let frequencies : any[] = [];
    let purposes : any[] = [];

    const labels = await this.labelCateRepo.findBy({clinic_id : clinicId });
    labels.forEach(label => {
      if (label.type === 2) {
        frequencies.push({label : label.name, value: label.name});
      }
      if (label.type === 3) {
        purposes.push({label : label.name, value: label.name});
      }
    });

    return {
      doctors,
      patients,
      payment_types : paymentTypes,
      frequencies,
      purposes,
      medicines,
      clinic_services : clinicServices
    }
  }

  async getTransactionService(transactionInvoiceId : number) {
    const transaction = await this.transactionRepo.findOne({
      where : {
        id : transactionInvoiceId,
      },
      relations : ['patient', 'patient.user', 'patient.user.clinic' ,'services']
    })

    return {
      data : transaction
    }
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

  async exportInvoice(id : number) {
    const templatePath = join(__dirname, '..', 'templates', 'transaction-invoice.ejs');
    const transactionInvoice = await this.transactionRepo.findOne({ 
      where : {
        id
      },
      relations : [
        'services', 
        'patient', 
        'patient.user',
        'doctor', 
        'doctor.user'
      ] 
    });

    if (!transactionInvoice) {
      throw new NotFoundException('Certificate not found');
    }

    const clinicSetting = await this.clinicDocumentRepo.findOneBy({clinic_id : transactionInvoice.clinic_id});
    if (!clinicSetting) {
      throw new NotFoundException('Clinic Setting not found');
    }

    const templateData = {
      'patient_name'      : `${transactionInvoice.patient.user.first_name} ${transactionInvoice.patient.user.last_name}`,
      'invoice_number'    : transactionInvoice.invoice_number,
      'invoice_date'      : moment(transactionInvoice.bill_date).format('DD/MM/YYYY'),
      'id_number'         : transactionInvoice.patient.user.id_number ?? 'N/A',
      'patient_dob'       : transactionInvoice.patient.user.dob,
      'patient_address'   : 'Address',
    }

    let body = clinicSetting.transaction_invoice_template;
    body = parseTemplateContent(body, templateData);

    const htmlContent = await ejs.renderFile(templatePath, {
      title: this.i18n.t('main.messages.transaction.invoice'),
      header: clinicSetting.header,
      countryCode : await this.helpService.getCurrencyCode(transactionInvoice.clinic_id),
      transactionInvoice,
      paymentType : transactionInvoice.payment_type,
      __ : this.i18n.t.bind(this.i18n),
      body
    });

    const pdfBuffer = await this.pdfService.createPdfFromHtml(htmlContent);
    return pdfBuffer;
  } 
}
