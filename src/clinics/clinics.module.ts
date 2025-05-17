import { Module } from '@nestjs/common';
import { ClinicsService } from './clinics.service';
import { ClinicsController } from './clinics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { City } from '../entites/city.entity';
import { State } from '../entites/state.entity';
import { Clinic } from '../entites/clinic.entity';
import { Address } from '../entites/address.entity';
import { Country } from '../entites/country.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Clinic, Address, City, Country, State]),
    AuthModule,
  ],
  controllers: [ClinicsController],
  providers: [ClinicsService],
})
export class ClinicsModule {}
