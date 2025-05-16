import { Module } from '@nestjs/common';
import { ClinicsService } from './clinics.service';
import { ClinicsController } from './clinics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clinic } from './entities/clinic.entity';
import { AuthModule } from '../auth/auth.module';
import { Address } from './entities/address.entity';
import { City } from './entities/city.entity';
import { Country } from './entities/country.entity';
import { State } from './entities/state.entity';

@Module({
  imports : [
    TypeOrmModule.forFeature([Clinic, Address, City, Country, State]),
    AuthModule
  ],
  controllers: [ClinicsController],
  providers: [ClinicsService],
})
export class ClinicsModule {}
