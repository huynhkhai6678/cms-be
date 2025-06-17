import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '../entites/appointment.entitty';
import { AuthModule } from '../auth/auth.module';
import { DatabaseServiceModule } from '../shared/database/database.module';
import { User } from '../entites/user.entity';
import { Patient } from '../entites/patient.entity';
import { Doctor } from '../entites/doctor.entity';
import { HelperModule } from '../helper/helper.module';
import { Visit } from '../entites/visit.entity';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, User, Patient, Doctor, Visit]),
    NotificationModule,
    AuthModule,
    DatabaseServiceModule,
    HelperModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
