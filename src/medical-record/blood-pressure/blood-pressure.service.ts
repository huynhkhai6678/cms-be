import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBloodPressureDto } from './dto/create-blood-pressure.dto';
import { UpdateBloodPressureDto } from './dto/update-blood-pressure.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientMedicalRecordBloodPressure } from '../../entites/patient-medical-record-blood-pressure.entity';
import { Repository } from 'typeorm';
import { DatabaseService } from '../../shared/database/database.service';

@Injectable()
export class BloodPressureService {
  constructor(
    @InjectRepository(PatientMedicalRecordBloodPressure)
    private readonly medicalRecordRepo: Repository<PatientMedicalRecordBloodPressure>,
    private database: DatabaseService,
  ) { }

  async create(createBloodPressureDto: CreateBloodPressureDto) {
    const subscriber = this.medicalRecordRepo.create(createBloodPressureDto);
    return this.medicalRecordRepo.save(subscriber);
  }

  async findAll(id : number, query: any) {
    return await this.database.paginateAndSearch<PatientMedicalRecordBloodPressure>({
      repository: this.medicalRecordRepo,
      alias: 'blood_pressue',
      query: {
        patient_medical_record_id: id,
        ...query
      },
      searchFields: ['name', 'email', 'phone'],
      filterFields: ['patient_medical_record_id'],
      allowedOrderFields: ['name', 'email', 'phone'],
      defaultOrderField: 'created_at',
      defaultOrderDirection: 'DESC',
      selectFields: [],
      relations: [],
    });
  }

  async findOne(id: number) {
    return {
      data: await this.medicalRecordRepo.findOneBy({ id }),
    };
  }

  async update(id: number, updateBloodPressureDto: UpdateBloodPressureDto) {
    const bloodPressure = await this.medicalRecordRepo.findOneBy({ id });
    if (!bloodPressure) {
      throw new NotFoundException('Blood pressure not found');
    }
  
    return this.medicalRecordRepo.update({ id }, updateBloodPressureDto);
  }

  async remove(id: number) {
    const bloodPressure = await this.medicalRecordRepo.findOneBy({ id });
    if (!bloodPressure) {
      throw new NotFoundException('Blood pressure not found');
    }
  
    return await this.medicalRecordRepo.remove(bloodPressure);
  }

  async findChart(id : number) {
    const data = await this.medicalRecordRepo.findBy({ patient_medical_record_id : id});
    return {
      data
    }
  }
}
