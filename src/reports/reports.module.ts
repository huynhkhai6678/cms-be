import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionInvoice } from '../entites/transaction-invoice.entity';
import { TransactionInvoiceService } from '../entites/transaction-invoice-service.entity';
import { PaymentGateway } from '../entites/payment-gateways.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentGateway,
      TransactionInvoice,
      TransactionInvoiceService,
    ]),
    AuthModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
