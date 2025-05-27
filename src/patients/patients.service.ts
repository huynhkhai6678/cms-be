import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from '../entites/patient.entity';
import { User } from '../entites/user.entity';
import { Visit } from '../entites/visit.entity';
import { HelperService, SingleSelect2Option } from '../helper/helper.service';
import { Address } from '../entites/address.entity';
import { PatientMedicalRecord } from '../entites/patient-medical-record.entity';
import { hashPassword } from '../utils/hash.util';
import { UserRole } from 'src/constants/user.constant';
import { Appointment } from 'src/entites/appointment.entitty';
import { Doctor } from 'src/entites/doctor.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient) private patientRepository: Repository<Patient>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Address) private addressRepository: Repository<Address>,
    @InjectRepository(PatientMedicalRecord) private patientMedicalRepository: Repository<PatientMedicalRecord>,
    @InjectRepository(Appointment) private apptRepository: Repository<Appointment>,
    private helpService: HelperService
  ) {}

  async create(createPatientDto: CreatePatientDto, imageUrl) {
    const hashed = await hashPassword(createPatientDto.password);

    // Create user
    const userDto = this.userRepository.create(createPatientDto);
    userDto.password = hashed;
    userDto.type = UserRole.PATIENT;
    if (imageUrl) {
      userDto.image_url = imageUrl;
    }
    const user = await this.userRepository.save(userDto);
    

    // Create address
    const address = this.addressRepository.create(createPatientDto);
    address.owner_id = user.id;
    address.owner_type = 'App\\Models\\Patient';
    await this.addressRepository.save(address);

    // Create patient
    const patientDto = this.patientRepository.create(createPatientDto);
    patientDto.user_id = user.id;
    const patient = await this.patientRepository.save(patientDto);

    const patientMedicalDto = this.patientMedicalRepository.create(createPatientDto);
    patientMedicalDto.patient_id = patient.id;
    await this.patientMedicalRepository.save(patientMedicalDto);
  }

  async findAll(query) {
    return await this.getPaginatedPatients(query);
  }

  async findDetail(id) {
    const patient = await this.patientRepository.findOne({
      where : {
        id,
      },
      relations : ['user', 'appointments']
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    
    return {
      data : {
        name : `${patient.user?.first_name} ${patient.user?.last_name}`,
        email : patient.user?.email,
        contact : `+${patient.user?.region_code} ${patient?.user?.contact}`,
        image_url : patient.user?.image_url,
        patient_mrn : patient.patient_mrn,
        blood_group : patient.user?.blood_group,
        gender : patient.user?.gender,
        dob : patient.user?.dob,
        address : patient.user?.address?.address1,
        register_on : patient.user?.created_at,
        last_update : patient.user?.updated_at,
        appointments : patient.appointments
      }
    }
  }

  async findOne(id: number, clinicId: number) {
    const patient = await this.patientRepository.findOneBy({id});
    const user = await this.getUserAndAddress(patient?.user_id); 

    const doctors = await this.helpService.clinicDoctor(clinicId);
    const countries = await this.helpService.getAllCountries();

    let states: SingleSelect2Option[] = [];
    let cities: SingleSelect2Option[] = [];
    if (user?.address?.country_id) {
      states = await this.helpService.getStateByCountry(user?.address?.country_id);
    }

    if (user?.address?.state_id) {
      cities = await this.helpService.getCityByState(user?.address?.state_id);
    }

    let patient_unique_id = patient ? patient.patient_unique_id : await this.generatePatientUniqueId();
    let patient_mrn = patient ? patient.patient_mrn : await this.generatePatientMRN();

    return {
      data : {
        patient_unique_id: patient?.patient_unique_id,
        patient_mrn: patient?.patient_mrn,
        first_name: user.first_name,
        last_name: user.last_name,
        full_name: `${user.first_name} ${user.last_name}`,
        gender: user.gender,
        dob: user.dob,
        marital_status: user.marital_status ? parseInt(user.marital_status) : null,
        id_type: parseInt(user.id_type),
        id_number: user.id_number,
        contact: user.contact,
        email: user.email,
        nationality: user.nationality,
        race: parseInt(user.race),
        religion: parseInt(user.religion),
        ethnicity: parseInt(user.ethnicity),
        address1: user.address?.address1,
        address2: user.address?.address2,
        country_id: user.address?.country_id,
        state_id: user.address?.state_id,
        city_id: user.address?.city_id,
        postal_code: user.address?.postal_code,
        other_contact: user.address?.other_contact,
        other_address1: user.address?.other_address1,
        other_address2: user.address?.other_address2,
        other_country_id: user.address?.other_country_id,
        blood_group: user.blood_group ? parseInt(user.blood_group) : null,
        G6PD: user.G6PD ? parseInt(user.G6PD) : null,
        allergy: user.allergy,
        food_allergy: user.food_allergy,
        important_notes: user.important_notes
      },
      patient_unique_id,
      patient_mrn,
      doctors,
      countries,
      states,
      cities
    }
  }

  async update(id: number, updatePatientDto: UpdatePatientDto, imageUrl) {
    const patient = await this.patientRepository.findOne({ where: { id } });
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    const user = await this.userRepository.findOne({ where: { id : patient.user_id } });
    if (!user) {
      throw new NotFoundException(`User with Patient ID ${id} not found`);
    }

    const address = await this.addressRepository.findOne({ 
      where : {
        owner_type : 'App\\Models\\Patient',
        owner_id : user.id
      }
    });

    if (!address) {
      throw new NotFoundException(`Addressa with Patient ID ${id} not found`);
    }

    // Merge the updated fields into the user entity
    Object.assign(user, updatePatientDto);
    if (imageUrl) {
      user.image_url = imageUrl;
    }
    await this.userRepository.save(user);

    // Merge the updated fields into the address entity
    Object.assign(address, updatePatientDto);
    await this.addressRepository.save(address);
    return true;
  }

  async remove(id: number) {
    const patient = await this.patientRepository.findOneBy({id});
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    const patientMedical = await this.patientMedicalRepository.findOneBy({patient_id: patient.id});
    if (patientMedical) {
      await this.patientMedicalRepository.remove(patientMedical);
    }

    await this.patientRepository.remove(patient);

    const user = await this.userRepository.findOneBy({id : patient.user_id});
    if (user) {
      const address = await this.addressRepository.findOne({
        where : {
          owner_type : 'App\\Models\\Patient',
          owner_id : user.id
        }
      });

      if (address) {
        await this.addressRepository.remove(address);
      }
      await this.userRepository.remove(user);
    }
  }

  async findAppointment(id, query) {
    return await this.getPaginatedPatientAppointment(id, query);
  }

  async getPaginatedPatientAppointment(id : number, query: any) {
    const take = !isNaN(Number(query.limit)) && Number(query.limit) > 0 ? Number(query.limit) : 10;
    const page = !isNaN(Number(query.page)) && Number(query.page) > 0 ? Number(query.page) : 1;
    const skip = (page - 1) * take;

    const qb = this.apptRepository.createQueryBuilder('appointment');
    // Join doctor with user
    qb.leftJoinAndMapOne(
      'appointment.doctor',
      Doctor,
      'doctor',
      'appointment.doctor_id = doctor.id',
    );

    qb.leftJoinAndMapOne(
      'doctor.user',
      User,
      'user',
      'doctor.user_id = user.id',
    );

    qb.select([
      'appointment.id AS appontment_id',
      'doctor.id AS doctor_id',
      'user.id AS user_id',
      'user.email AS user_email',
      'user.image_url AS user_image_url',
      'appointment.date AS appointment_at',
      'appointment.from_time AS from_time',
      'appointment.from_time_type AS from_time_type',
      'appointment.to_time AS to_time',
      'appointment.to_time_type AS to_time_type',
      'appointment.status AS appointment_status',
      `CONCAT(user.first_name, ' ', user.last_name) as full_name`,
    ]);

    // Search functionality
    if (query.search) {
      qb.andWhere(
        `CONCAT(user.first_name, ' ', user.last_name) LIKE :search`,
        { search: `%${query.search}%` },
      );
    }

    qb.andWhere('appointment.patient_id = :id', { id });

    // Order by logic (can also order by concatenated full_name)
    const orderableFieldsMap = {
      full_name: "CONCAT(user.first_name, ' ', user.last_name)",
      appointment_at: "user.date",
    };

    const orderByField =
      query.orderBy && orderableFieldsMap[query.orderBy]
        ? orderableFieldsMap[query.orderBy]
        : 'appointment.id';

    const orderDirection =
      query.order && ['ASC', 'DESC'].includes(query.order.toUpperCase())
        ? query.order.toUpperCase()
        : 'DESC';

    qb.orderBy(orderByField, orderDirection as 'ASC' | 'DESC');
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

  async getPaginatedPatients(query: any) {
    const take = !isNaN(Number(query.limit)) && Number(query.limit) > 0 ? Number(query.limit) : 10;
    const page = !isNaN(Number(query.page)) && Number(query.page) > 0 ? Number(query.page) : 1;
    const skip = (page - 1) * take;

    const qb = this.patientRepository.createQueryBuilder('patient');
    // Join doctor with user
    qb.leftJoinAndMapOne(
      'patient.user',
      User,
      'user',
      'patient.user_id = user.id',
    );

    qb.leftJoinAndMapMany(
      'patient.visits',
      Visit,
      'visit',
      'visit.patient_id = patient.id',
    );

    qb.select([
      'patient.id AS patient_id',
      'user.id AS user_id',
      'user.email AS user_email',
      'user.dob AS user_dob',
      'user.id_number AS user_id_number',
      'user.email_verified_at AS user_email_verified_at',
      'user.created_at AS user_created_at',
      `CONCAT('+ ', user.region_code, user.contact) as user_contact`,
      `CONCAT(user.first_name, ' ', user.last_name) as full_name`,
      `COUNT(visit.id) AS total_visit`
    ]);

    qb.groupBy('patient.id, user.id');

    // Search functionality
    if (query.search) {
      qb.andWhere(
        `CONCAT(user.first_name, ' ', user.last_name) LIKE :search OR user.id_number LIKE :search OR user.contact LIKE :search`,
        { search: `%${query.search}%` },
      );
    }

    // Filter by clinic_id (user_clinics.clinic_id)
    if (query.clinic_id) {
      qb.andWhere('user.clinic_id = :clinic_id', { clinic_id: query.clinic_id });
    }

    // Order by logic (can also order by concatenated full_name)
    const orderableFieldsMap = {
      full_name: "CONCAT(user.first_name, ' ', user.last_name)",
      email_verified_at: "user.email_verified_at",
    };

    const orderByField =
      query.orderBy && orderableFieldsMap[query.orderBy]
        ? orderableFieldsMap[query.orderBy]
        : 'patient.id';

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

  async getUserAndAddress(userId) {
    const user = await this.userRepository.findOneBy({id : userId});
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const address = await this.addressRepository.findOne({
      where : {
        owner_type : 'App\\Models\\Patient',
        owner_id : userId
      }
    });

    if (address) {
      user.address = address;
    }
    return user;
  }

  async generatePatientMRN() {
    const lastPatient = await this.patientRepository
      .createQueryBuilder('patient')
      .orderBy('patient.patient_mrn', 'DESC')
      .limit(1)
      .getOne();

    let nextNumber: string;
    if (lastPatient) {
      const lastMRN = parseInt(lastPatient.patient_mrn, 10);
      nextNumber = (lastMRN + 1).toString().padStart(6, '0');
    } else {
      nextNumber = '000001';
    }

    return nextNumber;
  }

  async generatePatientUniqueId() {
    let patientUniqueId = this.generateUniqueId(8);

    while (true) {
      const isExist = await this.patientRepository.findOne({
        where: { patient_unique_id: patientUniqueId },
      });

      if (isExist) {
        patientUniqueId = this.generateUniqueId(8);
        continue;
      }
      break;
    }

    return patientUniqueId;
  }

  generateUniqueId(length: number = 8): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let uniqueId = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      uniqueId += charset[randomIndex];
    }
    return uniqueId;
  }
}
