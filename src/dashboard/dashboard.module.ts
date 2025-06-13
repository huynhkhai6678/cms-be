import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { User } from '../entites/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserClinic } from '../entites/user-clinic.entity';
import { Clinic } from '../entites/clinic.entity';
import { Appointment } from '../entites/appointment.entitty';
import { TransactionInvoice } from '../entites/transaction-invoice.entity';
import { Visit } from '../entites/visit.entity';
import { AuthModule } from '../auth/auth.module';
import { DatabaseServiceModule } from '../shared/database/database.module';
import { Patient } from '../entites/patient.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Patient,
      User,
      UserClinic,
      Clinic,
      Appointment,
      TransactionInvoice,
      Visit,
    ]),
    AuthModule,
    DatabaseServiceModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
