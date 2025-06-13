import {
  BadRequestException,
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

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private authService: AuthService,
    private helpService: HelperService,
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

  findAll() {
    return `This action returns all appointments`;
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
    Object.assign(appointment, updateAppointmentDto);
    const result = this.appointmentRepository.save(appointment);
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
