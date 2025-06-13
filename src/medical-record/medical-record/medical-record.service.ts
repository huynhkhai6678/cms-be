import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientMedicalRecord } from '../../entites/patient-medical-record.entity';
import { Repository } from 'typeorm';
import { PatientMedicalRecordHistory } from 'src/entites/patient-medical-record-history.entity';
import { CreateNoteDto } from './dto/create-note-dto';
import { UpdateNoteDto } from './dto/update-note-dto';

@Injectable()
export class MedicalRecordService {
  constructor(
    @InjectRepository(PatientMedicalRecord)
    private readonly medicalRecordRepo: Repository<PatientMedicalRecord>,
    @InjectRepository(PatientMedicalRecordHistory)
    private readonly medicalRecordHistoryRepo: Repository<PatientMedicalRecordHistory>,
  ) {}

  async findOne(id: number) {
    const data = await this.medicalRecordRepo.findOne({
      where: {
        id,
      },
      relations: ['patient', 'patient.user'],
    });

    if (!data) {
      throw new NotFoundException('Patient not found');
    }

    return {
      data: {
        clinic_id: data.clinic_id,
        email: data.patient.user.email,
        full_name: `${data.patient.user.first_name} ${data.patient.user.last_name}`,
        image_url: data.patient.user.image_url,
        phone: `+${data.patient.user.region_code} ${data.patient.user.contact}`,
        allergy: data.allergy,
        important_notes: data.important_notes,
      },
    };
  }

  async findHistories(id: number) {
    const data = await this.medicalRecordHistoryRepo
      .createQueryBuilder('history')
      .leftJoin('history.user', 'user')
      .select(['history', 'user.first_name', 'user.last_name'])
      .where('history.patient_medical_record_id = :id', { id })
      .getMany();

    data.forEach((item) => {
      if (item.type === 2) {
        item.note_data = JSON.parse(item.data);
      }
    });

    return {
      data,
    };
  }

  async createNote(createNoteDto: CreateNoteDto, user: any) {
    const history = this.medicalRecordHistoryRepo.create(createNoteDto);
    history.data = JSON.stringify({
      notes: createNoteDto.notes,
      diagnosis: createNoteDto.diagnosis,
    });
    history.created_by = user.id;
    history.type = 2;

    return await this.medicalRecordHistoryRepo.save(history);
  }

  async updateNote(id: number, updateNoteDto: UpdateNoteDto, user: any) {
    const history = await this.medicalRecordHistoryRepo.findOneBy({ id });
    if (!history) {
      throw new NotFoundException('History not found');
    }

    history.data = JSON.stringify({
      notes: updateNoteDto.notes,
      diagnosis: updateNoteDto.diagnosis,
    });
    history.created_by = user.id;
    return await this.medicalRecordHistoryRepo.save(history);
  }

  async removeNote(id: number) {
    const history = await this.medicalRecordHistoryRepo.findOneBy({ id });
    if (!history) {
      throw new NotFoundException('History not found');
    }

    return await this.medicalRecordHistoryRepo.remove(history);
  }

  async addHistory(userId: number, medicalRecordId: number, data: any) {
    const historyDto = this.medicalRecordHistoryRepo.create();
    historyDto.patient_medical_record_id = medicalRecordId;
    historyDto.created_by = userId;
    historyDto.data = data;

    const history = this.medicalRecordHistoryRepo.save(historyDto);
    const medicalRecord = await this.medicalRecordRepo.findOneBy({
      id: medicalRecordId,
    });
    if (medicalRecord && !medicalRecord.changed) {
      medicalRecord.changed = true;
      await this.medicalRecordRepo.save(medicalRecord);
    }

    return history;
  }
}
