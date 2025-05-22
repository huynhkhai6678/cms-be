import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting } from '../entites/setting.entity';
import { Specialization } from '../entites/specilization.entity';
import { Currency } from '../entites/currency.entity';
import { State } from '../entites/state.entity';
import { Country } from '../entites/country.entity';
import { City } from '../entites/city.entity';
import { AuthModule } from '../auth/auth.module';
import { Clinic } from '../entites/clinic.entity';
import { Address } from '../entites/address.entity';
import { PaymentGateway } from '../entites/payment-gateways.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Setting,
      Specialization,
      Currency,
      City,
      Country,
      State,
      Clinic,
      Address,
      PaymentGateway,
    ]),
    AuthModule,
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
