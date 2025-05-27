import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '../constants/user.constant';
import { City } from '../entites/city.entity';
import { Country } from '../entites/country.entity';
import { Doctor } from '../entites/doctor.entity';
import { Patient } from '../entites/patient.entity';
import { State } from '../entites/state.entity';
import { UserClinic } from '../entites/user-clinic.entity';
import { User } from '../entites/user.entity';
import { Repository } from 'typeorm';
import { PaymentGateway } from 'src/entites/payment-gateways.entity';
import { PatientMedicalRecord } from 'src/entites/patient-medical-record.entity';

@Injectable()
export class HelperService {
  constructor(
    @InjectRepository(Doctor) private doctorRepo: Repository<Doctor>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Patient) private patientRepo: Repository<Patient>,
    @InjectRepository(Country) private countryRepo: Repository<Country>,
    @InjectRepository(State) private stateRepo: Repository<State>,
    @InjectRepository(City) private cityRepo: Repository<City>,
    @InjectRepository(PatientMedicalRecord) private patientMedicalRepository: Repository<PatientMedicalRecord>,
    @InjectRepository(PaymentGateway) private gatewayRepo: Repository<PaymentGateway>,
  ) {}

  async clinicDoctor(id: number) {
    const qb = this.doctorRepo.createQueryBuilder('doctor');
    qb.leftJoinAndMapOne(
      'doctor.user',
      User,
      'user',
      'doctor.user_id = user.id',
    );
    qb.leftJoinAndMapMany(
      'user.user_clinics',
      UserClinic,
      'userClinic',
      'user.id = userClinic.user_id',
    );

    qb.andWhere('userClinic.clinic_id = :clinic_id', { clinic_id : id});
    qb.andWhere('user.type = :type', { type : UserRole.DOCTOR});

    qb.select([
      'doctor.id as value',
      `CONCAT(user.first_name, ' ', user.last_name) as label`
    ])

    return await qb.getRawMany()
  }

  async clinicPatient(id: number) {
    const qb = this.patientRepo.createQueryBuilder('patient');
    qb.leftJoinAndMapOne(
      'patient.user',
      User,
      'user',
      'patient.user_id = user.id',
    );

    qb.andWhere('user.clinic_id = :clinic_id', { clinic_id : id});
    qb.andWhere('user.type = :type', { type : UserRole.PATIENT});

    qb.select([
      'patient.id as value',
      `CONCAT(user.first_name, ' ', user.last_name) as label`,
      'user.id_type as id_type',
      'user.id_number as id_number',
      'user.region_code as region_code',
      'user.contact as contact',
      'user.dob as dob'
    ])

    return await qb.getRawMany();
  }

  async doctorService(id: number, clinicId : number) {
    const services = await this.doctorRepo
      .createQueryBuilder('doctor')
      .leftJoin('doctor.services', 'service')
      .select('service.*')
      .where('doctor.id = :id', { id })
      .andWhere('service.clinic_id = :clinicId', { clinicId })
      .getRawMany();

    return services.map(service => {return {value:service.id, label: service.name, charges: service.charges}});
  }

  async getPaymentGateways(id: number) {
    const gateways = await this.gatewayRepo.findBy({clinic_id : id});
    return gateways.map(gateway => {return {value:gateway.payment_gateway_id, label: gateway.payment_gateway}});
  }

  async getAllCountries() {
    const countries = await this.countryRepo.find();
    return countries.map(country => { return {label : country.name, value: country.id}});
  }

  async getStateByCountry(id) {
    const states = await this.stateRepo.findBy({
      country_id: id,
    });
    return states.map(state => { return {label : state.name, value: state.id}});
  }

  async getCityByState(id) {
    const cities = await this.cityRepo.findBy({ state_id: id });
    return cities.map(city => { return {label : city.name, value: city.id}});
  }

  async generateUniqueIdInDatabase(repository, column) {
    let patientUniqueId = this.generateUniqueId(8);
    while (true) {
      const isExist = await repository.findOne({
        where: { [column]: patientUniqueId },
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

  async generatePatientMRN() {
    const lastPatient = await this.patientRepo
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

  async createNewPatient(dto) {
    const userDto = new User();
    Object.assign(userDto, dto);
    userDto.first_name = dto.patient_name;
    userDto.type = UserRole.PATIENT;
    const user = await this.userRepo.save(userDto);

    const patientDto = new Patient();
    patientDto.user_id = user.id;
    patientDto.patient_unique_id = await this.generateUniqueIdInDatabase(this.patientRepo, 'patient_unique_id');
    patientDto.patient_mrn = await this.generatePatientMRN();
    const patient = await this.patientRepo.save(patientDto);

    const medicalRecord = new PatientMedicalRecord();
    medicalRecord.patient_id = patient.id;
    await this.patientMedicalRepository.save(medicalRecord);
    return patient;
  }
}

export interface SingleSelect2Option {
  label: string;
  value: any;
}
