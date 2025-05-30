import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { PrismaServiceModule } from 'src/shared/prisma/prisma.module';
import { User } from '../entites/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserClinic } from '../entites/user-clinic.entity';
import { Clinic } from '../entites/clinic.entity';
import { Appointment } from '../entites/appointment.entitty';
import { TransactionInvoice } from '../entites/transaction-invoice.entity';
import { Visit } from '../entites/visit.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserClinic,
      Clinic,
      Appointment,
      TransactionInvoice,
      Visit,
    ]),
    AuthModule,
    PrismaServiceModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
