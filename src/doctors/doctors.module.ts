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
import { Review } from 'src/entites/review.entity';
import { Clinic } from 'src/entites/clinic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, User, Address, Specialization, Review, Clinic]), AuthModule, DatabaseServiceModule],
  controllers: [DoctorsController],
  providers: [DoctorsService],
})
export class DoctorsModule {}
