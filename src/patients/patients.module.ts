import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from '../entites/doctor.entity';
import { AuthModule } from '../auth/auth.module';
import { Patient } from '../entites/patient.entity';
import { User } from '../entites/user.entity';
import { HelperModule } from '../helper/helper.module';
import { Address } from '../entites/address.entity';
import { PatientMedicalRecord } from '../entites/patient-medical-record.entity';
import { Appointment } from '../entites/appointment.entitty';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Doctor, User, Address, PatientMedicalRecord, Appointment]), AuthModule, HelperModule],
  controllers: [PatientsController],
  providers: [PatientsService],
})
export class PatientsModule {}
