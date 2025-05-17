import { Module } from '@nestjs/common';
import { ClinicChainsService } from './clinic-chains.service';
import { ClinicChainsController } from './clinic-chains.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicChain } from '../entites/clinic-chain.entity';
import { DatabaseServiceModule } from '../shared/database/database.module';
import { Clinic } from '../entites/clinic.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClinicChain, Clinic]),
    DatabaseServiceModule,
  ],
  controllers: [ClinicChainsController],
  providers: [ClinicChainsService],
})
export class ClinicChainsModule {}
