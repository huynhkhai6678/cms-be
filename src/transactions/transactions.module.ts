import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionInvoice } from '../entites/transaction-invoice.entity';
import { AuthModule } from '../auth/auth.module';
import { HelperModule } from '../helper/helper.module';
import { Label } from '../entites/label.entity';
import { Medicine } from '../entites/medicine.entity';
import { ClinicService } from '../entites/clinic-service.entity';
import { TransactionInvoiceService } from '../entites/transaction-invoice-service.entity';
import { ClinicDocumentSetting } from '../entites/clinic-document-setting.entity';
import { PdfService } from '../shared/pdf/pdf.service';

@Module({
  imports : [
    TypeOrmModule.forFeature([
      TransactionInvoice,
      TransactionInvoiceService,
      ClinicDocumentSetting,
      Label,
      Medicine,
      ClinicService
    ]),
    HelperModule,
    AuthModule
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, PdfService],
})
export class TransactionsModule {}
