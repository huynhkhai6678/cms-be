import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePulseRateDto } from './dto/create-pulse-rate.dto';
import { UpdatePulseRateDto } from './dto/update-pulse-rate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseService } from '../../shared/database/database.service';
import { PatientMedicalRecordPulseRate } from '../../entites/patient-medical-record-pulse-rate.entity';

@Injectable()
export class PulseRateService {
  constructor(
    @InjectRepository(PatientMedicalRecordPulseRate)
    private readonly medicalRecordRepo: Repository<PatientMedicalRecordPulseRate>,
    private database: DatabaseService,
  ) {}

  async create(createPulseRateDto: CreatePulseRateDto) {
    const subscriber = this.medicalRecordRepo.create(createPulseRateDto);
    return this.medicalRecordRepo.save(subscriber);
  }

  async findAll(id: number, query: any) {
    return await this.database.paginateAndSearch<PatientMedicalRecordPulseRate>(
      {
        repository: this.medicalRecordRepo,
        alias: 'pulse_rate',
        query: {
          patient_medical_record_id: id,
          ...query,
        },
        searchFields: ['pulse'],
        filterFields: ['patient_medical_record_id'],
        allowedOrderFields: ['pulse'],
        defaultOrderField: 'created_at',
        defaultOrderDirection: 'DESC',
        selectFields: [],
        relations: [],
      },
    );
  }

  async findOne(id: number) {
    return {
      data: await this.medicalRecordRepo.findOneBy({ id }),
    };
  }

  async update(id: number, updatePulseRateDto: UpdatePulseRateDto) {
    const bloodPressure = await this.medicalRecordRepo.findOneBy({ id });
    if (!bloodPressure) {
      throw new NotFoundException('Blood pressure not found');
    }

    return this.medicalRecordRepo.update({ id }, updatePulseRateDto);
  }

  async remove(id: number) {
    const bloodPressure = await this.medicalRecordRepo.findOneBy({ id });
    if (!bloodPressure) {
      throw new NotFoundException('Blood pressure not found');
    }

    return await this.medicalRecordRepo.remove(bloodPressure);
  }

  async findChart(id: number) {
    const data = await this.medicalRecordRepo.findBy({
      patient_medical_record_id: id,
    });
    return {
      data,
    };
  }
}
