import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseService } from '../../shared/database/database.service';
import { PatientMedicalRecordTemperature } from '../../entites/patient-medical-record-pulse-temperature.entity';
import { CreateTemperatureDto } from './dto/create-temperature.dto';
import { UpdateTemperatureDto } from './dto/update-temperature.dto';

@Injectable()
export class TemperatureService {
  constructor(
    @InjectRepository(PatientMedicalRecordTemperature)
    private readonly medicalRecordRepo: Repository<PatientMedicalRecordTemperature>,
    private database: DatabaseService,
  ) {}

  async create(createTemperatureDto: CreateTemperatureDto) {
    const temperature = this.medicalRecordRepo.create(createTemperatureDto);
    return this.medicalRecordRepo.save(temperature);
  }

  async findAll(id: number, query: any) {
    return await this.database.paginateAndSearch<PatientMedicalRecordTemperature>(
      {
        repository: this.medicalRecordRepo,
        alias: 'temperature',
        query: {
          patient_medical_record_id: id,
          ...query,
        },
        searchFields: ['temperature'],
        filterFields: ['patient_medical_record_id'],
        allowedOrderFields: ['temperature'],
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

  async update(id: number, updateTemperatureDto: UpdateTemperatureDto) {
    const temperature = await this.medicalRecordRepo.findOneBy({ id });
    if (!temperature) {
      throw new NotFoundException('Temperature not found');
    }

    return this.medicalRecordRepo.update({ id }, updateTemperatureDto);
  }

  async remove(id: number) {
    const temperature = await this.medicalRecordRepo.findOneBy({ id });
    if (!temperature) {
      throw new NotFoundException('Temperature not found');
    }

    return await this.medicalRecordRepo.remove(temperature);
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
