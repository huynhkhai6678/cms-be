import { Module } from '@nestjs/common';
import { DoctorHolidaysService } from './doctor-holidays.service';
import { DoctorHolidaysController } from './doctor-holidays.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { DoctorHoliday } from '../entites/doctor-holiday.entity';
import { HelperModule } from '../helper/helper.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DoctorHoliday]),
    AuthModule,
    HelperModule,
  ],
  controllers: [DoctorHolidaysController],
  providers: [DoctorHolidaysService],
})
export class DoctorHolidaysModule {}
