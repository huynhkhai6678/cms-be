import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionInvoice } from '../entites/transaction-invoice.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../entites/patient.entity';
import { User } from '../entites/user.entity';
import { HelperService } from '../helper/helper.service';
import { Label } from '../entites/label.entity';
import { Medicine } from '../entites/medicine.entity';
import { ClinicService } from '../entites/clinic-service.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionInvoice)
    private readonly transactionRepo: Repository<TransactionInvoice>,
    @InjectRepository(Label)
    private readonly labelCateRepo: Repository<Label>,
    @InjectRepository(Medicine)
    private readonly medicineRepo: Repository<Medicine>,
    @InjectRepository(ClinicService)
    private readonly clinicServiceRepo: Repository<ClinicService>,
    private helpService: HelperService
  ) {}

  create(createTransactionDto: CreateTransactionDto) {
    return 'This action adds a new transaction';
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
      qb.andWhere('transaction_invoice.created_at >= :startDate', { startDate: query.start_date });
    }

    if (query.end_date) {
      qb.andWhere('transaction_invoice.created_at <= :endDate', { endDate: query.end_date });
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

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
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
}
