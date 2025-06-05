import { Module } from '@nestjs/common';
import { HelperService } from './helper.service';
import { HelperController } from './helper.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from '../entites/doctor.entity';
import { Patient } from '../entites/patient.entity';
import { User } from '../entites/user.entity';
import { AuthModule } from '../auth/auth.module';
import { Country } from '../entites/country.entity';
import { State } from '../entites/state.entity';
import { City } from '../entites/city.entity';
import { Service } from '../entites/service.entity';
import { PaymentGateway } from '../entites/payment-gateways.entity';
import { PatientMedicalRecord } from '../entites/patient-medical-record.entity';
import { Setting } from '../entites/setting.entity';
import { Currency } from '../entites/currency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, Patient, User, Country, State, City, Service, PaymentGateway, PatientMedicalRecord, Currency, Setting]), AuthModule],
  controllers: [HelperController],
  providers: [HelperService],
  exports: [HelperService]
})
export class HelperModule {}
