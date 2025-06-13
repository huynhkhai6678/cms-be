import { Module } from '@nestjs/common';
import { PulseRateService } from './pulse-rate.service';
import { PulseRateController } from './pulse-rate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module';
import { DatabaseServiceModule } from '../../shared/database/database.module';
import { MedicalRecordModule } from '../medical-record/medical-record.module';
import { PatientMedicalRecordPulseRate } from 'src/entites/patient-medical-record-pulse-rate.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PatientMedicalRecordPulseRate]),
    MedicalRecordModule,
    DatabaseServiceModule,
    AuthModule,
  ],
  controllers: [PulseRateController],
  providers: [PulseRateService],
})
export class PulseRateModule {}
