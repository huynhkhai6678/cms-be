import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import * as moment from 'moment';
import { AppointmentStatus } from '../constants/appointment-status.constant';
import { UserRole } from 'src/constants/user.constant';
import { I18nService } from 'nestjs-i18n';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entites/user.entity';
import { Equal, LessThan, MoreThan, Not, Repository } from 'typeorm';
import { Appointment } from 'src/entites/appointment.entitty';
import { TransactionInvoice } from 'src/entites/transaction-invoice.entity';
import { Visit } from 'src/entites/visit.entity';

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
    private prisma: PrismaService,
    private i18n: I18nService,
  ) {}

  async getUserCardData(user) {
    const doctorCount = await this.userRepo
      .createQueryBuilder('user')
      .innerJoin('user.user_clinics', 'user_clinic') // Join the UserClinic table (relation alias 'user_clinic')
      .innerJoin('user_clinic.clinic', 'clinic') // Join Clinic through the UserClinic relation
      .where('user.type = :type', { type: UserRole.DOCTOR })
      .andWhere('user.status = :status', { status: true })
      .andWhere('clinic.id = :clinicId', { clinicId: user.clinic_id }) // Filter by clinic ID
      .getCount();

    const patientCount = await this.userRepo
      .createQueryBuilder('user')
      .innerJoin('user.user_clinics', 'user_clinic') // Join the UserClinic table (relation alias 'user_clinic')
      .innerJoin('user_clinic.clinic', 'clinic') // Join Clinic through the UserClinic relation
      .where('user.type = :type', { type: UserRole.PATIENT })
      .andWhere('clinic.id = :clinicId', { clinicId: user.clinic_id }) // Filter by clinic ID
      .getCount();

    const appointmentCount = await this.appoitnementRepo
      .createQueryBuilder('appointment')
      .where('appointment.date = :date', {
        date: moment().format('YYYY-MM-DD'),
      })
      .andWhere('appointment.status = :status', {
        status: AppointmentStatus.BOOKED,
      })
      .andWhere('appointment.date = :clinicId', { clinicId: user.clinic_id }) // Filter by clinic ID
      .getCount();

    const registerCount = await this.userRepo
      .createQueryBuilder('user')
      .innerJoin('user.user_clinics', 'user_clinic') // Join the UserClinic table (relation alias 'user_clinic')
      .innerJoin('user_clinic.clinic', 'clinic') // Join Clinic through the UserClinic relation
      .where('user.type = :type', { type: UserRole.PATIENT })
      .where('user.created_at = :date', { date: moment().format('YYYY-MM-DD') })
      .andWhere('user.status = :status', { status: true })
      .andWhere('clinic.id = :clinicId', { clinicId: user.clinic_id }) // Filter by clinic ID
      .getCount();

    return {
      doctor_count: doctorCount,
      patient_count: patientCount,
      today_appointment_count: appointmentCount,
      total_registered_patient: registerCount,
    };
  }

  async getUpcommingAppointmentData(user) {
    let data = {};

    if (user.type === UserRole.DOCTOR) {
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
          clinic_id: doctorUser.clinic_id,
          doctor_id: doctorUser.doctor.id,
          date: MoreThan(moment().format('YYYY-MM-DD')),
          status: Not(Equal(AppointmentStatus.CANCELLED)),
        },
      });

      const todayAppointmentCount = await this.appoitnementRepo.count({
        where: {
          clinic_id: doctorUser.clinic_id,
          doctor_id: doctorUser.doctor.id,
          date: Equal(moment().format('YYYY-MM-DD')),
          status: Not(Equal(AppointmentStatus.CANCELLED)),
        },
      });

      const totalAppointmentCount = await this.appoitnementRepo.count({
        where: {
          clinic_id: doctorUser.clinic_id,
          doctor_id: doctorUser.doctor.id,
          status: Equal(AppointmentStatus.BOOKED),
        },
      });

      data = {
        upcoming_appointments: upcomingAppointmentCount,
        total_appointments: totalAppointmentCount,
        today_appointments: todayAppointmentCount,
      };
    } else if (user.type === UserRole.PATIENT) {
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
          clinic_id: user.clinic_id,
          date: MoreThan(moment().format('YYYY-MM-DD')),
        },
      });

      const totalAppointmentCount = await this.appoitnementRepo.count({
        where: {
          clinic_id: user.clinic_id,
        },
      });

      data = {
        upcoming_appointments: upcomingAppointmentCount,
        total_appointments: totalAppointmentCount,
      };
    }
    return data;
  }

  async getVisitCard(user) {
    if (user.type === UserRole.PATIENT || user.type === UserRole.DOCTOR) {
      return null;
    }

    const startDay = moment().startOf('day').toDate();
    const endDay = moment().endOf('day').toDate();
    const startMonth = moment().startOf('month').toDate();
    const endMonth = moment().endOf('month').toDate();
    const startYear = moment().startOf('year').toDate();
    const endYear = moment().endOf('year').toDate();

    const visits = await this.visitRepo
      .createQueryBuilder('visit')
      .where('visit.clinic_id = :clinicId', { clinicId: user.clinic_id })
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

  async getAdminRevenueData(user, req) {
    const yearStart = moment().startOf('year').format('YYYY-MM-DD');
    const yearEnd = moment().endOf('year').format('YYYY-MM-DD');

    const { serviceId = '', clinicId = '' } = req.body || {};
    let filters = `t.status = 1 AND t.created_at BETWEEN '${yearStart}' AND '${yearEnd}'`;

    if (serviceId) {
      filters += ` AND s.type = ${serviceId}`;
    }

    if (clinicId) {
      filters += ` AND t.clinic_id = ${clinicId}`;
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

  ayn;
}
