import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module';
import { DatabaseServiceModule } from '../../shared/database/database.module';
import { MedicalRecordModule } from '../medical-record/medical-record.module';
import { PatientMedicalRecordTemperature } from 'src/entites/patient-medical-record-pulse-temperature.entity';
import { TemperatureController } from './temperature.controller';
import { TemperatureService } from './temperature.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PatientMedicalRecordTemperature,
    ]),
    MedicalRecordModule,
    DatabaseServiceModule,
    AuthModule,
  ],
  controllers: [TemperatureController],
  providers: [TemperatureService],
})
export class TemperatureModule {}
