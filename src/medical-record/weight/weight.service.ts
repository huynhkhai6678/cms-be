import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWeightDto } from './dto/create-weight.dto';
import { UpdateWeightDto } from './dto/update-weight.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseService } from '../../shared/database/database.service';
import { PatientMedicalRecordWeight } from '../../entites/patient-medical-record-pulse-weight.entity';

@Injectable()
export class WeightService {
  constructor(
    @InjectRepository(PatientMedicalRecordWeight)
    private readonly medicalRecordRepo: Repository<PatientMedicalRecordWeight>,
    private database: DatabaseService,
  ) { }

  async create(createWeightDto: CreateWeightDto) {
    const weight = this.medicalRecordRepo.create(createWeightDto);
    return this.medicalRecordRepo.save(weight);
  }

  async findAll(id : number, query: any) {
    return await this.database.paginateAndSearch<PatientMedicalRecordWeight>({
      repository: this.medicalRecordRepo,
      alias: 'weight',
      query: {
        patient_medical_record_id: id,
        ...query
      },
      searchFields: ['weight'],
      filterFields: ['patient_medical_record_id'],
      allowedOrderFields: ['weight'],
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

  async update(id: number, updateBloodPressureDto: UpdateWeightDto) {
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
