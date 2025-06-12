import { Module } from '@nestjs/common';
import { BloodPressureService } from './blood-pressure.service';
import { BloodPressureController } from './blood-pressure.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientMedicalRecordBloodPressure } from '../../entites/patient-medical-record-blood-pressure.entity';
import { AuthModule } from '../../auth/auth.module';
import { DatabaseServiceModule } from '../../shared/database/database.module';
import { MedicalRecordModule } from '../medical-record/medical-record.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PatientMedicalRecordBloodPressure,
    ]),
    MedicalRecordModule,
    DatabaseServiceModule,
    AuthModule,
  ],
  controllers: [BloodPressureController],
  providers: [BloodPressureService],
})
export class BloodPressureModule {}
