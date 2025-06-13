import { Module } from '@nestjs/common';
import { WeightController } from './weight.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module';
import { DatabaseServiceModule } from '../../shared/database/database.module';
import { MedicalRecordModule } from '../medical-record/medical-record.module';
import { WeightService } from './weight.service';
import { PatientMedicalRecordWeight } from '../../entites/patient-medical-record-pulse-weight.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PatientMedicalRecordWeight]),
    MedicalRecordModule,
    DatabaseServiceModule,
    AuthModule,
  ],
  controllers: [WeightController],
  providers: [WeightService],
})
export class WeightModule {}
