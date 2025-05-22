import { Module } from '@nestjs/common';
import { ClinicSchedulesService } from './clinic-schedules.service';
import { ClinicSchedulesController } from './clinic-schedules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicSchedule } from '../entites/clinic-schedule.entity';
import { SessionWeekDay } from '../entites/session-week-days.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClinicSchedule, SessionWeekDay]),
    AuthModule,
  ],
  controllers: [ClinicSchedulesController],
  providers: [ClinicSchedulesService],
})
export class ClinicSchedulesModule {}
