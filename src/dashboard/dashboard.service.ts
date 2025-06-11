import { Injectable, NotFoundException } from '@nestjs/common';
import * as moment from 'moment';
import { AppointmentStatus } from '../constants/appointment-status.constant';
import { UserRole } from '../constants/user.constant';
import { I18nService } from 'nestjs-i18n';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entites/user.entity';
import { Equal, MoreThan, Not, Repository } from 'typeorm';
import { Appointment } from '../entites/appointment.entitty';
import { TransactionInvoice } from '../entites/transaction-invoice.entity';
import { Visit } from '../entites/visit.entity';
import { DatabaseService } from '../shared/database/database.service';
import { Patient } from 'src/entites/patient.entity';
import { Doctor } from 'src/entites/doctor.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Appointment)
    private readonly appoitnementRepo: Repository<Appointment>,
    @InjectRepository(TransactionInvoice)
    private readonly transactionRepo: Repository<TransactionInvoice>,
    @InjectRepository(Visit)
    private readonly visitRepo: Repository<Visit>,
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
    private dataTable: DatabaseService,
    private i18n: I18nService,
  ) {}

  async getUserCardData(user : any, queryParams) {
    let clinicId = user.clinic_id;
    if (queryParams.clinic_id) {
      clinicId = queryParams.clinic_id;
    }
    const doctorCount = await this.userRepo
      .createQueryBuilder('user')
      .innerJoin('user.user_clinics', 'user_clinic')
      .innerJoin('user_clinic.clinic', 'clinic')
      .where('user.type = :type', { type: UserRole.DOCTOR })
      .andWhere('user.status = :status', { status: true })
      .andWhere('clinic.id = :clinicId', { clinicId })
      .getCount();

    const patientCount = await this.userRepo
      .createQueryBuilder('user')
      .innerJoin('user.user_clinics', 'user_clinic')
      .innerJoin('user_clinic.clinic', 'clinic')
      .where('user.type = :type', { type: UserRole.PATIENT })
      .andWhere('clinic.id = :clinicId', { clinicId })
      .getCount();

    const appointmentCount = await this.appoitnementRepo
      .createQueryBuilder('appointment')
      .where('appointment.date = :date', {
        date: moment().format('YYYY-MM-DD'),
      })
      .andWhere('appointment.status = :status', {
        status: AppointmentStatus.BOOKED,
      })
      .andWhere('appointment.date = :clinicId', { clinicId }) // Filter by clinic ID
      .getCount();

    const registerCount = await this.userRepo
      .createQueryBuilder('user')
      .innerJoin('user.user_clinics', 'user_clinic') // Join the UserClinic table (relation alias 'user_clinic')
      .innerJoin('user_clinic.clinic', 'clinic') // Join Clinic through the UserClinic relation
      .where('user.type = :type', { type: UserRole.PATIENT })
      .where('user.created_at = :date', { date: moment().format('YYYY-MM-DD') })
      .andWhere('user.status = :status', { status: true })
      .andWhere('clinic.id = :clinicId', { clinicId }) // Filter by clinic ID
      .getCount();

    return {
      doctor_count: doctorCount,
      patient_count: patientCount,
      today_appointment_count: appointmentCount,
      total_registered_patient: registerCount,
    };
  }

  async getUpcommingAppointmentData(user : any, queryParams : any) {
    let data = {};
    const userType = parseInt(user.type);
    let clinicId = user.clinic_id;
    if (queryParams.clinic_id) {
      clinicId = queryParams.clinic_id;
    }

    if (userType === UserRole.DOCTOR) {
      const doctorUser = await this.userRepo.findOne({
        where: {
          id: user.id,
        },
        relations: ['doctor'],
      });

      if (!doctorUser) {
        throw new NotFoundException('Doctor not found');
      }

      const upcomingAppointmentCount = await this.appoitnementRepo.count({
        where: {
          clinic_id: clinicId,
          doctor_id: doctorUser.doctor.id,
          date: MoreThan(moment().format('YYYY-MM-DD')),
          status: Not(Equal(AppointmentStatus.CANCELLED)),
        },
      });

      const todayAppointmentCount = await this.appoitnementRepo.count({
        where: {
          clinic_id: clinicId,
          doctor_id: doctorUser.doctor.id,
          date: Equal(moment().format('YYYY-MM-DD')),
          status: Not(Equal(AppointmentStatus.CANCELLED)),
        },
      });

      const totalAppointmentCount = await this.appoitnementRepo.count({
        where: {
          clinic_id: clinicId,
          doctor_id: doctorUser.doctor.id,
          status: Equal(AppointmentStatus.BOOKED),
        },
      });

      data = {
        upcoming_appointments: upcomingAppointmentCount,
        total_appointments: totalAppointmentCount,
        today_appointments: todayAppointmentCount,
      };
    } else if (userType === UserRole.PATIENT) {
      const patientUser = await this.userRepo.findOne({
        where: {
          id: user.id,
        },
        relations: ['patient'],
      });

      if (!patientUser) {
        throw new NotFoundException('Patient not found');
      }

      const todayAppointmentCount = await this.appoitnementRepo.count({
        where: {
          clinic_id: patientUser.clinic_id,
          patient_id: patientUser.patient.id,
          date: Equal(moment().format('YYYY-MM-DD')),
        },
      });

      const upcomingAppointmentCount = await this.appoitnementRepo.count({
        where: {
          clinic_id: patientUser.clinic_id,
          patient_id: patientUser.patient.id,
          date: MoreThan(moment().format('YYYY-MM-DD')),
        },
      });

      const completedAppointment = await this.appoitnementRepo.count({
        where: {
          clinic_id: patientUser.clinic_id,
          patient_id: patientUser.patient.id,
          status: Not(Equal(AppointmentStatus.CHECK_OUT)),
        },
      });

      data = {
        upcoming_appointments: upcomingAppointmentCount,
        today_appointments: todayAppointmentCount,
        completed_appointments: completedAppointment,
      };
    } else {
      const upcomingAppointmentCount = await this.appoitnementRepo.count({
        where: {
          clinic_id: clinicId,
          date: MoreThan(moment().format('YYYY-MM-DD')),
        },
      });

      const totalAppointmentCount = await this.appoitnementRepo.count({
        where: {
          clinic_id: clinicId,
        },
      });

      data = {
        upcoming_appointments: upcomingAppointmentCount,
        total_appointments: totalAppointmentCount,
      };
    }
    return data;
  }

  async getVisitCard(user : any, queryParams : any) {
    const type = parseInt(user.type);
    if (type === UserRole.PATIENT || type === UserRole.DOCTOR) {
      return null;
    }

    let clinicId = user.clinic_id;
    if (queryParams.clinic_id) {
      clinicId = queryParams.clinic_id;
    }

    const startDay = moment().startOf('day').toDate();
    const endDay = moment().endOf('day').toDate();
    const startMonth = moment().startOf('month').toDate();
    const endMonth = moment().endOf('month').toDate();
    const startYear = moment().startOf('year').toDate();
    const endYear = moment().endOf('year').toDate();

    const visits = await this.visitRepo
      .createQueryBuilder('visit')
      .where('visit.clinic_id = :clinicId', { clinicId })
      .andWhere('visit.created_at > :startYear', { startYear })
      .andWhere('visit.created_at < :endYear', { endYear })
      .getMany();

    const today = visits.filter((v) => {
      const created = moment(v.created_at);
      return created.isBetween(startDay, endDay, null, '[]');
    }).length;

    const thisMonth = visits.filter((v) => {
      const created = moment(v.created_at);
      return created.isBetween(startMonth, endMonth, null, '[]');
    }).length;

    const thisYear = visits.length;

    return {
      today,
      this_month: thisMonth,
      this_year: thisYear,
    };
  }

  async getAdminRevenueData(queryParams: any) {
    const yearStart = moment().startOf('year').format('YYYY-MM-DD');
    const yearEnd = moment().endOf('year').format('YYYY-MM-DD');

    let filters = `t.status = 1 AND t.created_at BETWEEN '${yearStart}' AND '${yearEnd}'`;

    if (queryParams.service_id) {
      filters += ` AND s.type = ${queryParams.service_id}`;
    }

    if (queryParams.clinic_id) {
      filters += ` AND t.clinic_id = ${queryParams.clinic_id}`;
    }

    const query = `
      SELECT 
      MONTH(t.created_at) as month, 
      SUM(t.total) as total
      FROM transaction_invoices t
      LEFT JOIN transaction_invoice_services s ON s.transaction_invoice_id = t.id
      WHERE ${filters}
      GROUP BY MONTH(t.created_at)
    `;

    const results = await this.transactionRepo.query(query);

    const months = {
      1: this.i18n.translate('main.messages.months.jan'),
      2: this.i18n.translate('main.messages.months.feb'),
      3: this.i18n.translate('main.messages.months.mar'),
      4: this.i18n.translate('main.messages.months.apr'),
      5: this.i18n.translate('main.messages.months.may'),
      6: this.i18n.translate('main.messages.months.jun'),
      7: this.i18n.translate('main.messages.months.jul'),
      8: this.i18n.translate('main.messages.months.aug'),
      9: this.i18n.translate('main.messages.months.sep'),
      10: this.i18n.translate('main.messages.months.oct'),
      11: this.i18n.translate('main.messages.months.nov'),
      12: this.i18n.translate('main.messages.months.dec'),
    };

    const revenue = {};
    Object.values(months).forEach((name) => (revenue[name] = 0));
    results.forEach((row) => {
      const name = months[row.month];
      revenue[name] = parseFloat(row.total);
    });

    return revenue;
  }

  async getDoctorAppointmentData(req) {
    const yearStart = moment().startOf('year').format('YYYY-MM-DD');
    const yearEnd = moment().endOf('year').format('YYYY-MM-DD');

    const { clinicId = '' } = req.body || {};
    let filters = `a.date BETWEEN '${yearStart}' AND '${yearEnd}'`;

     if (clinicId) {
      filters += ` AND a.clinic_id = ${clinicId}`;
    }

    const query = `
      SELECT 
      MONTH(a.date) as month, 
      count(a.id) as total
      FROM appointments a
      WHERE ${filters}
      GROUP BY MONTH(a.date)
    `;

    const results = await this.transactionRepo.query(query);

    const months = {
      1: this.i18n.translate('main.messages.months.jan'),
      2: this.i18n.translate('main.messages.months.feb'),
      3: this.i18n.translate('main.messages.months.mar'),
      4: this.i18n.translate('main.messages.months.apr'),
      5: this.i18n.translate('main.messages.months.may'),
      6: this.i18n.translate('main.messages.months.jun'),
      7: this.i18n.translate('main.messages.months.jul'),
      8: this.i18n.translate('main.messages.months.aug'),
      9: this.i18n.translate('main.messages.months.sep'),
      10: this.i18n.translate('main.messages.months.oct'),
      11: this.i18n.translate('main.messages.months.nov'),
      12: this.i18n.translate('main.messages.months.dec'),
    };

    const revenue = {};
    Object.values(months).forEach((name) => (revenue[name] = 0));
    results.forEach((row) => {
      const name = months[row.month];
      revenue[name] = parseFloat(row.total);
    });

    return revenue;
  }

  async patientRegister(query) {
    const qb = this.patientRepo.createQueryBuilder('patient');

    qb.leftJoinAndMapOne(
      'patient.user',
      User,
      'user',
      'patient.user_id = user.id',
    );

    qb.leftJoinAndMapOne(
      'patient.appointment',
      Appointment,
      'appointment',
      'appointment.patient_id = patient.id',
    );

    qb.select([
      'patient.id AS patient_id',
      'patient.created_at AS created_at',
      'patient.patient_unique_id AS patient_unique_id',
      'user.email AS patient_email',
      'user.image_url AS patient_avatar',
      `COUNT(appointment.id) AS total_appointment`,
      `CONCAT(user.first_name, ' ', user.last_name) as patient_full_name`,
    ]);

    if (query.clinic_id) {
      qb.andWhere('user.clinic_id = :clinicId', { clinicId : query.clinic_id });
    }

    if (query.start_date) {
      qb.andWhere('patient.created_at >= :startDate', { startDate: `${query.start_date} 00:00:00` });
    }

    if (query.end_date) {
      qb.andWhere('patient.created_at <= :endDate', { endDate: `${query.end_date} 23:59:59` });
    }

    qb.groupBy('patient.id');

    // Fetch the results and total count
    const data = await qb.getRawMany();
    
    return {
      data
    };
  }

  async doctorAppointment(userId: number, clinicId : number, query : any) {
    const qb = this.appoitnementRepo.createQueryBuilder('appointment');

    userId = 99;

    qb.leftJoinAndMapOne(
      'appointment.doctor',
      Doctor,
      'doctor',
      'appointment.doctor_id = doctor.id',
    );

    qb.leftJoinAndMapOne(
      'doctor.user',
      User,
      'user_doctor',
      'doctor.user_id = user_doctor.id',
    );

    qb.leftJoinAndMapOne(
      'appointment.patient',
      Patient,
      'patient',
      'appointment.patient_id = patient.id',
    );

    qb.leftJoinAndMapOne(
      'patient.user',
      User,
      'user_patient',
      'patient.user_id = user_patient.id',
    );

    qb.select([
      'appointment.id AS appoitnment_id',
      'appointment.date AS appointment_date',
      'patient.patient_unique_id AS patient_unique_id',
      'user_patient.email AS patient_email',
      'user_patient.image_url AS patient_avatar',
      `CONCAT(user_patient.first_name, ' ', user_patient.last_name) as patient_full_name`,
    ]);

    qb.andWhere('user_doctor.id = :userId', { userId });
    qb.andWhere('user_doctor.clinic_id = :clinicId', { clinicId });

    if (query.start_date) {
      qb.andWhere('appointment.date >= :startDate', { startDate: `${query.start_date}` });
    }

    if (query.start_date) {
      qb.andWhere('appointment.date >= :startDate', { startDate: `${query.start_date}` });
    }

    if (query.end_date) {
      qb.andWhere('appointment.date <= :endDate', { endDate: `${query.end_date}` });
    }

    qb.groupBy('appointment.id');

    // Fetch the results and total count
    const data = await qb.getRawMany();
    
    return {
      data
    };
  }

  async patientTodayAppointment(userId: number, clinicId : number, query : any) {
    const today = moment().format('YYYY-MM-DD');
    const qb = this.appoitnementRepo.createQueryBuilder('appointment');

    qb.leftJoinAndMapOne(
      'appointment.doctor',
      Doctor,
      'doctor',
      'appointment.doctor_id = doctor.id',
    );

    qb.leftJoinAndMapOne(
      'doctor.user',
      User,
      'user_doctor',
      'doctor.user_id = user_doctor.id',
    );

    qb.leftJoinAndMapOne(
      'appointment.patient',
      Patient,
      'patient',
      'appointment.patient_id = patient.id',
    );

    qb.leftJoinAndMapOne(
      'patient.user',
      User,
      'user_patient',
      'patient.user_id = user_patient.id',
    );

    qb.select([
      'appointment.id AS appoitnment_id',
      'appointment.date AS appointment_date',
      'patient.patient_unique_id AS patient_unique_id',
      'user_patient.email AS patient_email',
      'user_patient.image_url AS patient_avatar',
      `CONCAT(user_patient.first_name, ' ', user_patient.last_name) as patient_full_name`,
    ]);

    qb.andWhere('user_doctor.id = :userId', { userId });
    qb.andWhere('user_doctor.clinic_id = :clinicId', { clinicId });
    qb.andWhere('appointment.date = :today', { today });
    qb.groupBy('appointment.id');

    // Fetch the results and total count
    const data = await qb.getRawMany();
    
    return {
      data
    };
  }

  async patientUpcommingAppointment(userId: number, clinicId : number, query : any) {
    const today = moment().format('YYYY-MM-DD');
    const qb = this.appoitnementRepo.createQueryBuilder('appointment');

    qb.leftJoinAndMapOne(
      'appointment.doctor',
      Doctor,
      'doctor',
      'appointment.doctor_id = doctor.id',
    );

    qb.leftJoinAndMapOne(
      'doctor.user',
      User,
      'user_doctor',
      'doctor.user_id = user_doctor.id',
    );

    qb.leftJoinAndMapOne(
      'appointment.patient',
      Patient,
      'patient',
      'appointment.patient_id = patient.id',
    );

    qb.leftJoinAndMapOne(
      'patient.user',
      User,
      'user_patient',
      'patient.user_id = user_patient.id',
    );

    qb.select([
      'appointment.id AS appoitnment_id',
      'appointment.date AS appointment_date',
      'patient.patient_unique_id AS patient_unique_id',
      'user_patient.email AS patient_email',
      'user_patient.image_url AS patient_avatar',
      `CONCAT(user_patient.first_name, ' ', user_patient.last_name) as patient_full_name`,
    ]);

    qb.andWhere('user_doctor.id = :userId', { userId });
    qb.andWhere('user_doctor.clinic_id = :clinicId', { clinicId });
    qb.andWhere('appointment.date > :today', { today });
    qb.groupBy('appointment.id');

    // Fetch the results and total count
    const data = await qb.getRawMany();
    
    return {
      data
    };
  }
}
