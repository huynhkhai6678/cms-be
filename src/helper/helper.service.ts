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
import { Address } from 'src/entites/address.entity';

@Injectable()
export class HelperService {
  constructor(
    @InjectRepository(Doctor) private doctorRepo: Repository<Doctor>,
    @InjectRepository(Patient) private patientRepo: Repository<Patient>,
    @InjectRepository(Country) private countryRepo: Repository<Country>,
    @InjectRepository(State) private stateRepo: Repository<State>,
    @InjectRepository(City) private cityRepo: Repository<City>,
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
    qb.leftJoinAndMapMany(
      'user.user_clinics',
      UserClinic,
      'userClinic',
      'user.id = userClinic.user_id',
    );

    qb.andWhere('userClinic.clinic_id = :clinic_id', { clinic_id : id});
    qb.andWhere('user.type = :type', { type : UserRole.PATIENT});

    qb.select([
      'patient.id as value',
      `CONCAT(user.first_name, ' ', user.last_name) as label`
    ])

    return await qb.getRawMany();
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
}

export interface SingleSelect2Option {
  label: string;
  value: any;
}
