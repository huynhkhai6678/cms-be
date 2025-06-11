import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientMedicalRecord } from '../../entites/patient-medical-record.entity';
import { Repository } from 'typeorm';
import { Patient } from '../../entites/patient.entity';

@Injectable()
export class MedicalRecordService {
  constructor(
    @InjectRepository(PatientMedicalRecord)
    private readonly medicalRecordRepo: Repository<PatientMedicalRecord>,
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
  ) { }

  async findOne(id: number) {
    const data = await this.medicalRecordRepo.findOne({
      where : {
        id
      },
      relations : ['patient', 'patient.user']
    })

    if (!data) {
      throw new NotFoundException('Patient not found');
    }

    return {
      data : {
        email : data.patient.user.email,
        full_name : `${data.patient.user.first_name} ${data.patient.user.last_name}`,
        image_url : data.patient.user.image_url,
        phone: `+${data.patient.user.region_code} ${data.patient.user.contact}`,
        allergy : data.allergy,
        important_notes: data.important_notes
      }
    }
  }
}
