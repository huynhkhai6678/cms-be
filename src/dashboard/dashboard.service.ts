import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import * as moment from 'moment';
import { AppointmentStatus } from '../constants/appointment-status.constant';
import { UserRole } from 'src/constants/user.constant';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private i18n: I18nService,
  ) {}

  async getUserCardData(user) {
    const doctorCount = await this.prisma.users.count({
      where: {
        type: UserRole.DOCTOR,
        status: true,
        user_clinics: {
          some: {
            clinic_id: user.clinic_id,
          },
        },
      },
    });

    const patientCount = await this.prisma.users.count({
      where: {
        type: UserRole.PATIENT,
        status: true,
        user_clinics: {
          some: {
            clinic_id: user.clinic_id,
          },
        },
      },
    });

    const appointmentCount = await this.prisma.appointments.count({
      where: {
        clinic_id: user.clinic_id,
        date: moment().format('YYYY-MM-DD'),
        status: AppointmentStatus.BOOKED,
      },
    });

    const registerCount = await this.prisma.users.count({
      where: {
        type: UserRole.PATIENT,
        created_at: moment().toDate(),
        user_clinics: {
          some: {
            clinic_id: user.clinic_id,
          },
        },
      },
    });

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
      const upcomingAppointmentCount = await this.prisma.appointments.count({
        where: {
          clinic_id: user.clinic_id,
          doctor_id: user.doctor.id,
          date: {
            gte: moment().format('YYYY-MM-DD'),
          },
          status: {
            not: AppointmentStatus.CANCELLED,
          },
        },
      });

      const todayAppointmentCount = await this.prisma.appointments.count({
        where: {
          clinic_id: user.clinic_id,
          doctor_id: user.doctor.id,
          date: moment().format('YYYY-MM-DD'),
          status: {
            not: AppointmentStatus.CANCELLED,
          },
        },
      });

      const totalAppointmentCount = await this.prisma.appointments.count({
        where: {
          clinic_id: user.clinic_id,
          doctor_id: user.doctor.id,
          status: AppointmentStatus.BOOKED,
        },
      });

      data = {
        upcoming_appointments: upcomingAppointmentCount,
        total_appointments: totalAppointmentCount,
        today_appointments: todayAppointmentCount,
      };
    } else if (user.type === UserRole.PATIENT) {
      const todayAppointmentCount = await this.prisma.appointments.count({
        where: {
          clinic_id: user.clinic_id,
          doctor_id: user.patient.id,
          date: {
            gt: moment().format('YYYY-MM-DD'),
          },
        },
      });

      const upcomingAppointmentCount = await this.prisma.appointments.count({
        where: {
          clinic_id: user.clinic_id,
          doctor_id: user.patient.id,
          date: {
            gt: moment().format('YYYY-MM-DD'),
          },
        },
      });

      const completedAppointment = await this.prisma.appointments.count({
        where: {
          clinic_id: user.clinic_id,
          patient_id: user.patient.id,
          date: moment().format('YYYY-MM-DD'),
          status: {
            not: AppointmentStatus.CHECK_OUT,
          },
        },
      });

      data = {
        upcoming_appointments: upcomingAppointmentCount,
        today_appointments: todayAppointmentCount,
        completed_appointments: completedAppointment,
      };
    } else {
      const upcomingAppointmentCount = await this.prisma.appointments.count({
        where: {
          clinic_id: user.clinic_id,
          date: {
            gt: moment().format('YYYY-MM-DD'),
          },
        },
      });

      const totalAppointmentCount = await this.prisma.appointments.count({
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

    const visits = await this.prisma.visits.findMany({
      where: {
        clinic_id: user.clinic_id,
        created_at: {
          gte: startYear,
          lte: endYear,
        },
      },
    });

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
      filters += ` AND a.service_id = ${serviceId}`;
    }

    if (clinicId) {
      filters += ` AND t.clinic_id = ${clinicId}`;
    }

    const query = `
            SELECT 
            MONTH(t.created_at) as month, 
            SUM(t.amount) as total
            FROM transactions t
            LEFT JOIN appointments a ON t.appointment_id = a.id
            LEFT JOIN services s ON a.service_id = s.id
            WHERE ${filters}
            GROUP BY MONTH(t.created_at)
        `;

    const results = await this.prisma.$queryRawUnsafe<any[]>(query);

    const months = {
      1: await this.i18n.translate('main.messages.months.jan'),
      2: await this.i18n.translate('main.messages.months.feb'),
      3: await this.i18n.translate('main.messages.months.mar'),
      4: await this.i18n.translate('main.messages.months.apr'),
      5: await this.i18n.translate('main.messages.months.may'),
      6: await this.i18n.translate('main.messages.months.jun'),
      7: await this.i18n.translate('main.messages.months.jul'),
      8: await this.i18n.translate('main.messages.months.aug'),
      9: await this.i18n.translate('main.messages.months.sep'),
      10: await this.i18n.translate('main.messages.months.oct'),
      11: await this.i18n.translate('main.messages.months.nov'),
      12: await this.i18n.translate('main.messages.months.dec'),
    };

    const revenue = {};
    Object.values(months).forEach((name) => (revenue[name] = 0));
    results.forEach((row) => {
      const name = months[row.month];
      revenue[name] = parseFloat(row.total);
    });

    return revenue;
  }
}
