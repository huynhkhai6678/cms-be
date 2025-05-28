import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Visit } from '../entites/visit.entity';
import { Repository } from 'typeorm';
import { HelperService } from '../helper/helper.service';
import { Doctor } from '../entites/doctor.entity';
import { Patient } from '../entites/patient.entity';
import { User } from '../entites/user.entity';
import { Appointment } from '../entites/appointment.entitty';
import * as moment from 'moment';

@Injectable()
export class VisitsService {
  constructor(
    @InjectRepository(Visit)
    private readonly visitRepository: Repository<Visit>,
    private helpService: HelperService
  ) {}

  async create(createVisitDto: CreateVisitDto) {
    const count = await this.checkVisitAvaiable(createVisitDto.patient_id);
    if (count > 0) {
      throw new BadRequestException('Queue already created for this patient');
    }

    const visit = this.visitRepository.create(createVisitDto);
    visit.visit_date = moment(createVisitDto.visit_date, 'DD/MM/YYYY hh:mm A').format('YYYY-MM-DD hh:mm:ss');
    visit.contact_no = createVisitDto.phone.e164Number.split(createVisitDto.phone.dialCode)[1];
    visit.region_code = createVisitDto.phone.dialCode.substring(1);
    
    if (createVisitDto.patient_name) {
      const patient = await this.helpService.createNewPatient(visit);
      visit.patient_id = patient.id;
    }

    const result = await this.visitRepository.save(visit);
    return result;
  }

  async findAll(query) {
    return await this.getPaginatedVisits(query);
  }

  async findOne(id: number, clinicId: number) {
    const visit = await this.visitRepository.findOne({
      where : {
        id
      },
    });

    const doctors = await this.helpService.clinicDoctor(clinicId);
    const patients = await this.helpService.clinicPatient(clinicId);

    let data = {
      clinic_id: visit?.clinic_id,
      visit_date: visit?.visit_date,
      patient_id: visit?.patient_id,
      visit_type: visit?.visit_type ? parseInt(visit?.visit_type) : null,
      description: visit?.description,
      important_notes: visit?.important_notes,
      doctor_id: visit?.doctor_id,
      dob: visit?.dob,
      phone: visit?.contact_no,
      id_type: visit?.id_type ? parseInt(visit?.id_type.toString()) : null,
      id_number: visit?.id_number ? parseInt(visit?.id_number.toString()) : '',
    }

    return {
      data : visit ? data : null,
      doctors,
      patients,
    }
  }

  async update(id: number, updateVisitDto: UpdateVisitDto) {
    const visit = await this.visitRepository.findOneBy({id});
    if (!visit) {
      throw new NotFoundException('Visit not found');
    }

    if (updateVisitDto.patient_name) {
      const patient = await this.helpService.createNewPatient(visit);
      visit.patient_id = patient.id;
    }
    
    Object.assign(visit, updateVisitDto);
    visit.visit_date = moment(updateVisitDto.visit_date, 'DD/MM/YYYY hh:mm A').format('YYYY-MM-DD hh:mm:ss');
    const result = this.visitRepository.save(visit);
    return result;
  }

  async remove(id: number) {
    const visit = await this.visitRepository.findOneBy({id});
    if (!visit) {
      throw new NotFoundException('Visit not found');
    }

    return await this.visitRepository.remove(visit);
  }

  async updateStatus(id: number, status: number) {
    const visit = await this.visitRepository.findOneBy({id});
    if (!visit) {
      throw new NotFoundException('Visit not found');
    }

    visit.status = status;
    const result = this.visitRepository.save(visit);
    return result;
  }

  async getPaginatedVisits(query: any) {
    const take = !isNaN(Number(query.limit)) && Number(query.limit) > 0 ? Number(query.limit) : 10;
    const page = !isNaN(Number(query.page)) && Number(query.page) > 0 ? Number(query.page) : 1;
    const skip = (page - 1) * take;

    const qb = this.visitRepository.createQueryBuilder('visit');
    // Join doctor with user
    qb.leftJoinAndMapOne(
      'visit.doctor',
      Doctor,
      'doctor',
      'visit.doctor_id = doctor.id',
    );

    qb.leftJoinAndMapOne(
      'visit.patient',
      Patient,
      'patient',
      'visit.patient_id = patient.id',
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
      'visit.appointment',
      Appointment,
      'appointment',
      'visit.appointment_id = appointment.id',
    );

    qb.select([
      'ROW_NUMBER() OVER (ORDER BY visit.id DESC) AS row_index',
      'visit.id AS visit_id',
      'visit.doctor_id AS doctor_id',
      'visit.visit_type AS visit_type',
      'visit.patient_id AS patient_id',
      'visit.visit_date AS visit_date',
      'visit.status AS visit_status',
      'visit.description AS visit_description',
      'visit.important_notes AS visit_important_notes',
      'user_patient.email AS patient_email',
      'user_patient.image_url AS patient_image_url',
      'user_patient.gender AS patient_gender',
      'user_patient.dob AS patient_dob',
      'user_patient.id_number AS patient_id_number',
      'user_patient.region_code AS patient_region_code',
      'user_patient.contact AS patient_contact',
      'appointment.date AS appointment_date',
      'appointment.from_time AS appointment_from_time',
      'appointment.from_time_type AS appointment_from_time_type',
      `CONCAT(user_patient.first_name, ' ', user_patient.last_name) as patient_full_name`,
      `CONCAT(user_doctor.first_name, ' ', user_doctor.last_name) as doctor_full_name`,
    ]);

    // Search functionality
    if (query.search) {
      qb.andWhere(
        `CONCAT(user.first_name, ' ', user.last_name) LIKE :search OR user.id_number LIKE :search OR user.contact LIKE :search`,
        { search: `%${query.search}%` },
      );
    }

    if (query.clinic_id) {
      qb.andWhere('visit.clinic_id = :clinicId', { clinicId: query.clinic_id });
    }

    if (query.start_date) {
      qb.andWhere('visit.created_at >= :startDate', { startDate: query.start_date });
    }

    if (query.end_date) {
      qb.andWhere('visit.clinic_id <= :endDate', { endDate: query.end_date });
    }

    // Order by logic (can also order by concatenated full_name)
    const orderableFieldsMap = {
      full_name: "CONCAT(user.first_name, ' ', user.last_name)",
      email_verified_at: "user.email_verified_at",
      row_index: "ROW_NUMBER() OVER (ORDER BY visit.id DESC)",
    };

    const orderByField =
      query.orderBy && orderableFieldsMap[query.orderBy]
        ? orderableFieldsMap[query.orderBy]
        : 'visit.id';

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

  async checkVisitAvaiable(patientId : number) {
    return await this.visitRepository.count({
      where : {
        patient_id : patientId,
        status : 1
      }
    })
  }
}
