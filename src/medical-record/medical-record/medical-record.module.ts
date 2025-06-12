import { Module } from '@nestjs/common';
import { MedicalRecordService } from './medical-record.service';
import { MedicalRecordController } from './medical-record.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from '../../entites/patient.entity';
import { PatientMedicalRecord } from '../../entites/patient-medical-record.entity';
import { AuthModule } from '../../auth/auth.module';
import { PatientMedicalRecordHistory } from '../../entites/patient-medical-record-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Patient,
      PatientMedicalRecord,
      PatientMedicalRecordHistory
    ]),
    AuthModule,
  ],
  controllers: [MedicalRecordController],
  providers: [MedicalRecordService],
  exports : [MedicalRecordService]
})
export class MedicalRecordModule {}
