import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionInvoiceService } from '../entites/transaction-invoice-service.entity';
import { TransactionInvoice } from '../entites/transaction-invoice.entity';
import { User } from '../entites/user.entity';
import { Repository } from 'typeorm';
import { Patient } from '../entites/patient.entity';
import * as moment from 'moment';
import { PaymentGateway } from '../entites/payment-gateways.entity';
import { PAYMENT_TYPE_VALUE } from '../constants/payment.constant';

@Injectable()
export class ReportsService {

  constructor(
    @InjectRepository(TransactionInvoice)
    private readonly transactionRepo: Repository<TransactionInvoice>,
    @InjectRepository(TransactionInvoiceService)
    private readonly transactionServiceRepo: Repository<TransactionInvoiceService>,
    @InjectRepository(PaymentGateway)
    private readonly paymentGatewayRepo: Repository<PaymentGateway>,
  ) {}

  findAll() {
    return `This action returns all reports`;
  }

  async saleTable(query : any) {
    const take = !isNaN(Number(query.limit)) && Number(query.limit) > 0 ? Number(query.limit) : 10;
    const page = !isNaN(Number(query.page)) && Number(query.page) > 0 ? Number(query.page) : 1;
    const skip = (page - 1) * take;

    const qb = this.transactionRepo.createQueryBuilder('transaction_invoice');
    qb.leftJoinAndMapOne(
      'transaction_invoice.patient',
      Patient,
      'patient',
      'transaction_invoice.user_id = patient.id',
    );

    qb.leftJoinAndMapOne(
      'patient.user',
      User,
      'user',
      'patient.user_id = user.id',
    );

    qb.select([
      'ROW_NUMBER() OVER (ORDER BY transaction_invoice.id DESC) AS row_index',
      'transaction_invoice.id',
      'transaction_invoice.invoice_number',
      'transaction_invoice.net_amount',
      'transaction_invoice.bill_date',
      'transaction_invoice.status',
      'transaction_invoice.payment_type',
      'patient.patient_mrn',
      'user.id_number',
      `CONCAT(user.first_name, ' ', user.last_name) as full_name`,
    ]);

    // Search functionality
    if (query.search) {
      qb.andWhere(
        `CONCAT(user.first_name, ' ', user.last_name) LIKE :search OR patient.patient_mrn LIKE :search OR user.id_number LIKE :search 
        OR transaction_invoice.invoice_number LIKE :search`,
        { search: `%${query.search}%` },
      );
    }

    // Filter by clinic_id (user_clinics.clinic_id)
    if (query.clinic_id) {
      qb.andWhere('transaction_invoice.clinic_id = :clinic_id', { clinic_id: query.clinic_id });
    }

    if (query.start_date) {
      qb.andWhere('transaction_invoice.bill_date >= :startDate', { startDate: `${query.start_date} 00:00:00` });
    }

    if (query.end_date) {
      qb.andWhere('transaction_invoice.bill_date <= :endDate', { endDate: `${query.end_date} 23:59:59` });
    }

    // Order by logic (can also order by concatenated full_name)
    const orderableFieldsMap = {
      full_name: "CONCAT(user.first_name, ' ', user.last_name)",
      patient_patient_mrn : "patient.patient_mrn",
      user_id_number : "user.id_number",
      transaction_invoice_invoice_number: "transaction_invoice.invoice_number",
      transaction_invoice_net_amount: "transaction_invoice.net_amount",
      bill_date: "transaction_invoice.bill_date",
      net_amount: "transaction_invoice.net_amount",
      row_index: "ROW_NUMBER() OVER (ORDER BY transaction_invoice.id DESC)",
    };

    const orderByField =
      query.orderBy && orderableFieldsMap[query.orderBy]
        ? orderableFieldsMap[query.orderBy]
        : 'transaction_invoice.id';

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

  async serviceTable(query : any) {
    const take = !isNaN(Number(query.limit)) && Number(query.limit) > 0 ? Number(query.limit) : 10;
    const page = !isNaN(Number(query.page)) && Number(query.page) > 0 ? Number(query.page) : 1;
    const skip = (page - 1) * take;

    const qb = this.transactionServiceRepo.createQueryBuilder('transaction_invoice_service');

    qb.leftJoinAndMapOne(
      'transaction_invoice_service.transaction_invoice',
      TransactionInvoice,
      'transaction_invoice',
      'transaction_invoice_service.transaction_invoice_id = transaction_invoice.id',
    );

    qb.leftJoinAndMapOne(
      'transaction_invoice.patient',
      Patient,
      'patient',
      'transaction_invoice.user_id = patient.id',
    );

    qb.leftJoinAndMapOne(
      'patient.user',
      User,
      'user',
      'patient.user_id = user.id',
    );

    qb.select([
      'ROW_NUMBER() OVER (ORDER BY transaction_invoice_service.id DESC) AS row_index',
      'transaction_invoice_service.id',
      'transaction_invoice_service.created_at',
      'transaction_invoice_service.type',
      'transaction_invoice_service.name',
      'transaction_invoice_service.quantity',
      'transaction_invoice_service.price',
      'transaction_invoice_service.sub_total',
      'transaction_invoice.invoice_number',
      'patient.patient_mrn',
      'user.id_number',
      `CONCAT(user.first_name, ' ', user.last_name) as full_name`,
    ]);

    // Search functionality
    if (query.search) {
      qb.andWhere(
        `CONCAT(user.first_name, ' ', user.last_name) LIKE :search OR patient.patient_mrn LIKE :search OR user.id_number LIKE :search 
        OR transaction_invoice.invoice_number LIKE :search`,
        { search: `%${query.search}%` },
      );
    }

    // Filter by clinic_id (user_clinics.clinic_id)
    if (query.clinic_id) {
      qb.andWhere('transaction_invoice.clinic_id = :clinic_id', { clinic_id: query.clinic_id });
    }

    if (query.start_date) {
      qb.andWhere('transaction_invoice.bill_date >= :startDate', { startDate: `${query.start_date} 00:00:00` });
    }

    if (query.end_date) {
      qb.andWhere('transaction_invoice.bill_date <= :endDate', { endDate: `${query.end_date} 23:59:59` });
    }

    // Order by logic (can also order by concatenated full_name)
    const orderableFieldsMap = {
      full_name: "CONCAT(user.first_name, ' ', user.last_name)",
      patient_patient_mrn : "patient.patient_mrn",
      user_id_number : "user.id_number",
      created_at: "transaction_invoice_service.created_at",
      sub_total: "transaction_invoice_service.sub_total",
      row_index: "ROW_NUMBER() OVER (ORDER BY transaction_invoice_service.id DESC)",
    };

    const orderByField =
      query.orderBy && orderableFieldsMap[query.orderBy]
        ? orderableFieldsMap[query.orderBy]
        : 'transaction_invoice_service.id';

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

  async saleChart(queryParam : any, request : any) {
    let startDate : Date | null = null;
    let endDate : Date | null = null;

    if (queryParam.start_date && queryParam.end_date) {
      startDate = moment(queryParam.start_date).startOf('day').toDate();
      endDate = moment(queryParam.end_date).endOf('day').toDate();
    }

    const clinic = queryParam.clinic_id || request.user.clinic_id;

    // Build query
    const query = this.transactionRepo.createQueryBuilder('invoice')
      .where('invoice.clinic_id = :clinic', { clinic });

    if (startDate && endDate) {
      query.andWhere('invoice.bill_date BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      });
    }

    const transactions = await query.getMany();
    const selectedPaymentGateways = await this.paymentGatewayRepo.find({
      where: { clinic_id: clinic },
      select: ['payment_gateway_id'],
    });

    const selectedIds = selectedPaymentGateways.map(pg => pg.payment_gateway_id);
    const groups: Record<string, number> = {};
    for (const key of Object.keys(PAYMENT_TYPE_VALUE)) {
      groups[key] = 0;
    }

    let total = 0;
    for (const transaction of transactions) {
      if (transaction.payment_type) {
        groups[transaction.payment_type] += transaction.total;
        total += transaction.total;
      } else {
        groups[0] += transaction.total;
        total += transaction.total;
      }
    }
    
    const chartData : any[] = [];
    if (total > 0) {
      for (const key in groups) {
        const isKeyInSelectedIds = selectedIds.map(id => Number(id)).includes(Number(key));
        if ((key !== '' && !isKeyInSelectedIds &&  Number(key) !== 0)) {
          continue;
        }

        const value = groups[key];
        chartData.push({
          name: PAYMENT_TYPE_VALUE[key],
          y: parseFloat(((value / total) * 100).toFixed(2)),
          x: parseFloat(value.toFixed(2)),
        });
      }
    }

    return {
      chart_data: chartData,
      total_transaction: transactions.length,
      total_revenue: `RM ${total.toFixed(2)}`
    };
  }

  async serviceInventoryChart(queryParam: any, request : any) {
    let startDate : Date | null = null;
    let endDate : Date | null = null;

    if (queryParam.start_date && queryParam.end_date) {
      startDate = moment(queryParam.start_date).startOf('day').toDate();
      endDate = moment(queryParam.end_date).endOf('day').toDate();
    }

    const clinic = queryParam.clinic_id || request.user.clinic_id;

    // Build query
    let query = this.transactionServiceRepo
      .createQueryBuilder('transaction_invoice_service')
      .leftJoinAndSelect('transaction_invoice_service.transaction_invoice', 'transaction_invoice')
      .where('transaction_invoice.clinic_id = :clinic_id', { clinic_id: clinic });

    if (startDate && endDate) {
      query = query.andWhere(
        'transaction_invoice.created_at BETWEEN :startDate AND :endDate',
        { startDate, endDate },
      );
    }

    const transactions = await query.getMany();
    const groups = {
      'Services': 0,
      'Inventories': 0,
    };

    let total = 0;
    transactions.forEach((service) => {
      if (groups.hasOwnProperty(service.type)) {
        groups[service.type] += service.sub_total;
        total += service.sub_total;
      }
    });

    const chartData : any[] = [];
    if (total > 0) {
      for (const [key, value] of Object.entries(groups)) {
        chartData.push({
          name: key,
          y: parseFloat(((value / total) * 100).toFixed(2)),
          x: parseFloat(value.toFixed(2)),
        });
      }
    }

    return {
      chart_data: chartData,
      total_transaction: transactions.length,
      total_revenue: `RM ${total.toFixed(2)}`,
    };
  }

  async serviceChart(queryParam: any, request : any, type : string = 'Services') {
    let startDate : Date | null = null;
    let endDate : Date | null = null;

    if (queryParam.start_date && queryParam.end_date) {
      startDate = moment(queryParam.start_date).startOf('day').toDate();
      endDate = moment(queryParam.end_date).endOf('day').toDate();
    }

    const clinic = queryParam.clinic_id || request.user.clinic_id;

    // Build query
     let query = this.transactionServiceRepo
      .createQueryBuilder('transaction_invoice_service')
      .leftJoinAndSelect('transaction_invoice_service.transaction_invoice', 'transaction_invoice')
      .where('transaction_invoice_service.type = :type', { type })
      .andWhere('transaction_invoice.clinic_id = :clinicId', { clinicId: clinic });


    if (startDate && endDate) {
      query = query.andWhere(
        'transaction_invoice.created_at BETWEEN :startDate AND :endDate',
        { startDate, endDate },
      );
    }

    const transactions = await query.getMany();

    const groups: { [key: string]: number } = {}
      let total = 0;

      transactions.forEach((service) => {
        if (groups[service.name]) {
          groups[service.name] += service.sub_total;
        } else {
          groups[service.name] = service.sub_total;
        }
        total += service.sub_total;
      });

      // Step 5: Prepare chart data
      const chartData : any[] = [];
      if (total > 0) {
        for (const [key, value] of Object.entries(groups)) {
          chartData.push({
            name: key,
            y: parseFloat(((value / total) * 100).toFixed(2)),
            x: parseFloat(value.toFixed(2)),
          });
        }
      }

      return {
        chart_data: chartData,
        total_revenue: `RM ${total.toFixed(2)}`,
      };
  }
}
