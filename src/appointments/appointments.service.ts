import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Appointment } from '../entites/appointment.entitty';
import * as moment from 'moment';
import { HelperService } from '../helper/helper.service';
import { UserRole } from '../constants/user.constant';
import { AuthService } from '../auth/auth.service';
import { User } from '../entites/user.entity';
import { AppointmentStatus } from '../constants/appointment-status.constant';
import { Visit } from '../entites/visit.entity';
import { VISIT_STATUS, VISIT_TYPE } from '../constants/visit.constant';
import { NotificationService } from '../notification/notification.service';
import { Patient } from '../entites/patient.entity';
import { Doctor } from '../entites/doctor.entity';
import { REQUEST } from '@nestjs/core';
import { QueryParamsDto } from '../shared/dto/query-params.dto';
import { Service } from '../entites/service.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Visit)
    private readonly visitRepository: Repository<Visit>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @Inject(REQUEST) private readonly request: any,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly helpService: HelperService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    createAppointmentDto.from_time_type =
      createAppointmentDto.from_time_value.split(' ')[1];
    createAppointmentDto.to_time_type =
      createAppointmentDto.to_time_value.split(' ')[1];
    createAppointmentDto.from_time =
      createAppointmentDto.from_time_value.split(' ')[0];
    createAppointmentDto.to_time =
      createAppointmentDto.to_time_value.split(' ')[0];

    await this.checkDoctorAvailability(createAppointmentDto);

    const appointment = this.appointmentRepository.create(createAppointmentDto);
    appointment.status = createAppointmentDto.status || 1;
    appointment.date = moment(appointment.date, 'DD/MM/YYYY').format(
      'YYYY-MM-DD',
    );
    appointment.appointment_unique_id =
      await this.helpService.generateUniqueIdInDatabase(
        this.appointmentRepository,
        'appointment_unique_id',
      );
    appointment.contact = createAppointmentDto.phone.e164Number.split(
      createAppointmentDto.phone.dialCode,
    )[1];
    appointment.region_code = createAppointmentDto.phone.dialCode.substring(1);

    if (createAppointmentDto.patient_name) {
      const patient = await this.helpService.createNewPatient(appointment);
      appointment.patient_id = patient.id;
    }

    const result = await this.appointmentRepository.save(appointment);
    return result;
  }

  async findAll(query : QueryParamsDto) {
    const take = !isNaN(Number(query.limit)) && Number(query.limit) > 0 ? Number(query.limit) : 10;
    const page = !isNaN(Number(query.page)) && Number(query.page) > 0 ? Number(query.page) : 1;
    const skip = (page - 1) * take;
    
    const qb = this.appointmentRepository.createQueryBuilder('appointment');

    // Join doctor with user
    qb.leftJoinAndMapOne(
      'appointment.doctor',
      Doctor,
      'doctor',
      'appointment.doctor_id = doctor.id',
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

    qb.leftJoinAndMapOne(
      'doctor.user',
      User,
      'user_doctor',
      'doctor.user_id = user_doctor.id',
    );

    qb.leftJoinAndMapOne(
      'appointment.service',
      Service,
      'service',
      'appointment.service_id = service.id',
    );

    qb.select([
      'appointment.id AS appointment_id',
      'appointment.doctor_id AS doctor_id',
      'appointment.patient_id AS patient_id',
      'appointment.clinic_id AS appointment_clinic_id',
      'appointment.date AS appointment_date',
      'appointment.from_time AS appointment_from_time',
      'appointment.from_time_type AS appointment_from_time_type',
      'appointment.to_time AS appointment_to_time',
      'appointment.to_time_type AS appointment_to_time_type',
      'appointment.service_id AS appointment_service_id',
      'appointment.description AS appointment_description',
      'service.name AS appointment_service',
      'user_patient.email AS patient_email',
      'user_patient.image_url AS patient_image_url',
      'user_patient.gender AS patient_gender',
      'user_patient.dob AS patient_dob',
      'user_patient.id_number AS patient_id_number',
      'user_patient.region_code AS patient_region_code',
      'user_patient.contact AS patient_contact',
      `CONCAT(user_patient.first_name, ' ', user_patient.last_name) as patient_full_name`,
      `CONCAT(user_doctor.first_name, ' ', user_doctor.last_name) as doctor_full_name`,
    ]);

    // Search functionality
    if (query.search) {
      qb.andWhere(
        `CONCAT(user.first_name, ' ', user.last_name) LIKE :search OR user.id_number LIKE :search OR user.contact LIKE :search LIKE service.name LIKE :search`,
        { search: `%${query.search}%` },
      );
    }

    if (query.clinic_id) {
      qb.andWhere('appointment.clinic_id = :clinicId', { clinicId: query.clinic_id });
    }

    if (query.start_date) {
      qb.andWhere('appointment.date >= :startDate', {
        startDate: query.start_date,
      });
    }

    if (query.end_date) {
      qb.andWhere('appointment.date <= :endDate', { endDate: query.end_date });
    }
    
    if (query.status) {
      qb.andWhere('appointment.status = :status', { status: query.status });
    }

    if (query.payment_type && query.payment_type > 0) {
      qb.andWhere('appointment.payment_type = :paymentType', { paymentType: query.payment_type });
    }

    // Order by logic (can also order by concatenated full_name)
    const orderableFieldsMap = {
      full_name: "CONCAT(user.first_name, ' ', user.last_name)",
      appointment_service : "service.name"
    };

    const orderByField: string =
      query.orderBy && orderableFieldsMap[query.orderBy]
        ? orderableFieldsMap[query.orderBy]
        : 'appointment.id';

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

  async findOne(id: number, clinicId: number) {
    const appointment = await this.appointmentRepository.findOneBy({ id });
    const doctors = await this.helpService.clinicDoctor(clinicId);
    const patients = await this.helpService.clinicPatient(clinicId);
    const paymentMethods = await this.helpService.getPaymentGateways(clinicId);

    let services: any = [];
    if (appointment) {
      services = await this.helpService.doctorService(
        appointment.doctor_id,
        appointment.clinic_id,
      );
    }

    const data = {
      clinic_id: appointment?.clinic_id,
      date: appointment?.date,
      from_time_value: `${appointment?.from_time} ${appointment?.from_time_type}`,
      to_time_value: `${appointment?.to_time} ${appointment?.to_time_type}`,
      patient_id: appointment?.patient_id,
      service_id: appointment?.service_id,
      description: appointment?.description,
      payment_type: appointment?.payment_type,
      payable_amount: appointment?.payable_amount,
      status: appointment?.status,
      doctor_id: appointment?.doctor_id,
      dob: appointment?.dob,
      phone: appointment?.contact,
      id_type: appointment?.id_type ? parseInt(appointment?.id_type) : 0,
      id_number: appointment?.id_number,
      age: appointment?.status,
    };

    return {
      data: appointment ? data : null,
      doctors,
      patients,
      services,
      payment_methods: paymentMethods,
    };
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    const appointment = await this.appointmentRepository.findOneBy({ id });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // Create new patient flow
    if (appointment.patient_name) {
      const patient = await this.helpService.createNewPatient(appointment);
      appointment.patient_id = patient.id;
    }

    appointment.contact =
      updateAppointmentDto.phone?.e164Number.split(
        updateAppointmentDto.phone.dialCode,
      )[1] || '';
    appointment.region_code =
      updateAppointmentDto.phone?.dialCode.substring(1) || '';
    appointment.from_time_type =
      updateAppointmentDto.from_time_value?.split(' ')[1];
    appointment.to_time_type =
      updateAppointmentDto.to_time_value?.split(' ')[1];
    appointment.from_time = updateAppointmentDto.from_time_value?.split(' ')[0];
    appointment.to_time = updateAppointmentDto.to_time_value?.split(' ')[0];
    appointment.contact =
      updateAppointmentDto.phone?.e164Number.split(
        updateAppointmentDto.phone.dialCode,
      )[1] || '';
    appointment.region_code =
      updateAppointmentDto.phone?.dialCode.substring(1) || '';

    await this.checkDoctorAvailability(appointment);

    const oldStatus = appointment.status;
    Object.assign(appointment, updateAppointmentDto);
    const result = await this.appointmentRepository.save(appointment);

    if (oldStatus !== updateAppointmentDto.status) {
      await this.checkStatus(appointment);
    }
    return result;
  }

  async remove(id: number) {
    const appointment = await this.appointmentRepository.findOneBy({ id });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return await this.appointmentRepository.remove(appointment);
  }

  async findAllCalendar(clinicId: number, user: User) {
    const canDo = await this.authService.isUserInClinic(user, clinicId);
    if (!canDo) {
      throw new UnauthorizedException(
        'You dont have permission in this clinic',
      );
    }

    const type = user.type;
    let appointments: Appointment[] = [];
    if (type === UserRole.DOCTOR) {
      appointments = await this.appointmentRepository.find({
        where: {
          clinic_id: clinicId,
          doctor: {
            user: {
              id: user.id,
            },
          },
        },
        relations: ['doctor.user', 'patient.user', 'service'],
      });
    } else if (type === UserRole.PATIENT) {
      appointments = await this.appointmentRepository.find({
        where: {
          clinic_id: clinicId,
          patient: {
            user: {
              id: user.id,
            },
          },
        },
        relations: ['doctor.user', 'patient.user', 'service'],
      });
    } else {
      appointments = await this.appointmentRepository.find({
        where: {
          clinic_id: clinicId,
        },
        relations: ['doctor.user', 'patient.user', 'service'],
      });
    }

    const data = appointments.map((appointment) => {
      const patientName =
        appointment.patient?.user?.first_name ?? appointment.patient_name;
      const startTime = `${appointment.from_time} ${appointment.from_time_type}`;
      const endTime = `${appointment.to_time} ${appointment.to_time_type}`;
      const patientContact = appointment.contact
        ? ` (+${appointment.region_code}) ${appointment.contact}`
        : '';

      const start = moment(
        `${appointment.date} ${startTime}`,
        'YYYY-MM-DD h:mm A',
      );
      const end = moment(`${appointment.date} ${endTime}`, 'YYYY-MM-DD h:mm A');

      return {
        id: appointment.id,
        title: `${appointment.from_time} <b>${appointment.from_time_type}</b> - ${appointment.to_time} <b>${appointment.to_time_type}</b><br>${patientName} ${patientContact}<br>${appointment.service.name}`,
        doctorName: appointment.doctor?.user?.first_name,
        patient: patientName,
        start: start.toISOString(),
        end: end.toISOString(),
        description: appointment.description,
        status: appointment.status,
        amount: appointment.payable_amount,
        uId: appointment.appointment_unique_id,
        service: appointment.service?.name,
        color: '#FFF',
        className: [this.getStatusClassName(appointment.status), 'text-white'],
      };
    });

    return data;
  }

  async checkStatus(appointment) {
    if (appointment.status === AppointmentStatus.CHECK_IN) {
      // Create visit
      const data = {
        doctor_id: appointment.doctor_id,
        patient_id: appointment.patient_id,
        visit_type: VISIT_TYPE.APPOINTMENT,
        visit_date: moment().format('YYYY-MM-DD hh:mm:ss'),
        id_type: appointment.id_type,
        id_number: appointment.id_number,
        dob: appointment.dob,
        age: moment().diff(moment(appointment.dob, 'DD/MM/YYYY'), 'years'),
        region_code: appointment.region_code,
        contact_no: appointment.contact,
        appointment_id: appointment.id,
        clinic_id: appointment.clinic_id
      }

      const visit = this.visitRepository.create(data);
      return await this.visitRepository.save(visit);

    } else if (appointment.status === AppointmentStatus.CHECK_OUT) {

      const fullTime = `${appointment.from_time}${appointment.from_time_type} - ${appointment.to_time}${appointment.to_time_type} ${moment(appointment.date).format('Do MMM, YYYY')}`;
      const patient = await this.patientRepository.findOne({
        where: {
          id: appointment.patient_id
        },
        relations : ['user']
      });

      if (!patient) {
        console.log('patient not found');
        return;
      }

      const doctor = await this.doctorRepository.findOne({
        where: {
          id: appointment.doctor_id
        },
        relations : ['user']
      });

      if (!doctor) {
        console.log('doctor not found');
        return;
      }
      
      await this.notificationService.create({
        title : `Your Appointment has been checkout by ${this.request.user.first_name} ${this.request.user.last_name}`,
        type: 'checkout',
        user_id : patient.user.id
      });

      await this.notificationService.create({
        title : `${patient.user.first_name} ${patient.user.last_name}'s appointment check out by ${this.request.user.first_name} ${this.request.user.last_name} at ${fullTime}`,
        type: 'checkout',
        user_id : doctor.user.id
      });

      const visit = await this.visitRepository.findOneBy({ appointment_id : appointment.id});
      if (visit) {
        visit.checkout_date = moment().toISOString();
        visit.status = VISIT_STATUS.STATUS_COMPLETED;
        await this.visitRepository.save(visit);
      }

      return true;
    } else if (appointment.status === AppointmentStatus.CANCELLED) {
      const fullTime = `${appointment.from_time}${appointment.from_time_type} - ${appointment.to_time}${appointment.to_time_type} ${moment(appointment.date).format('Do MMM, YYYY')}`;
      const patient = await this.patientRepository.findOne({
        where: {
          id: appointment.patient_id
        },
        relations : ['user']
      });

      if (!patient) {
        console.log('patient not found');
        return;
      }

      const doctor = await this.doctorRepository.findOne({
        where: {
          id: appointment.doctor_id
        },
        relations : ['user']
      });

      if (!doctor) {
        console.log('doctor not found');
        return;
      }
      
      await this.notificationService.create({
        title : `Your Appointment has been cancelled by ${this.request.user.first_name} ${this.request.user.last_name}`,
        type: 'canceled',
        user_id : patient.user.id
      });

      await this.notificationService.create({
        title : `${patient.user.first_name} ${patient.user.last_name}'s appointment cancelled by ${this.request.user.first_name} ${this.request.user.last_name}  at ${fullTime}`,
        type: 'canceled',
        user_id : doctor.user.id
      });

    }
  }

  getStatusClassName(status: number): string {
    const classNames = [
      'bg-status-canceled',
      'bg-status-booked',
      'bg-status-checkIn',
      'bg-status-checkOut',
    ];

    const index = status % classNames.length;
    return classNames[index];
  }

  async checkDoctorAvailability(input: {
    doctor_id: number;
    patient_id: number;
    date: string;
    from_time: string;
    to_time: string;
    from_time_type: string | undefined;
  }) {
    const appointment = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .where('appointment.doctor_id = :doctor_id', {
        doctor_id: input.doctor_id,
      })
      .andWhere('appointment.patient_id != :patient_id', {
        patient_id: input.patient_id,
      })
      .andWhere('appointment.date = :date', { date: input.date })
      .andWhere(
        new Brackets((qb) => {
          qb.where('appointment.from_time = :from_time', {
            from_time: input.from_time,
          }).orWhere(
            new Brackets((qb2) => {
              qb2
                .where('appointment.from_time < :from_time', {
                  from_time: input.from_time,
                })
                .andWhere('appointment.to_time > :from_time', {
                  from_time: input.from_time,
                });
            }),
          );
        }),
      )
      .andWhere('appointment.from_time_type = :from_time_type', {
        from_time_type: input.from_time_type,
      })
      .getOne();

    if (appointment) {
      throw new BadRequestException('This doctor is busy at this time');
    }
  }
}
