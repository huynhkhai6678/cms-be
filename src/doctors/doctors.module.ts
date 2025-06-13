import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from '../entites/doctor.entity';
import { AuthModule } from '../auth/auth.module';
import { DatabaseServiceModule } from '../shared/database/database.module';
import { Address } from '../entites/address.entity';
import { Specialization } from '../entites/specilization.entity';
import { User } from '../entites/user.entity';
import { Review } from '../entites/review.entity';
import { Clinic } from '../entites/clinic.entity';
import { Appointment } from '../entites/appointment.entitty';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Doctor,
      User,
      Address,
      Specialization,
      Review,
      Clinic,
      Appointment,
    ]),
    AuthModule,
    DatabaseServiceModule,
  ],
  controllers: [DoctorsController],
  providers: [DoctorsService],
})
export class DoctorsModule {}
