import { Module } from '@nestjs/common';
import { ClinicServicesService } from './clinic-services.service';
import { ClinicServicesController } from './clinic-services.controller';
import { DatabaseServiceModule } from '../shared/database/database.module';
import { ClinicService } from '../entites/clinic-service.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClinicService]),
    DatabaseServiceModule,
    AuthModule,
  ],
  controllers: [ClinicServicesController],
  providers: [ClinicServicesService],
})
export class ClinicServicesModule {}
