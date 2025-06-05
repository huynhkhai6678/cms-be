import { Module } from '@nestjs/common';
import { TransactionMedicalCertificateService } from './transaction-medical-certificate.service';
import { TransactionMedicalCertificateController } from './transaction-medical-certificate.controller';
import { HelperModule } from 'src/helper/helper.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionMedicalCertificate } from '../entites/transaction-medical-certificate.entity';
import { AuthModule } from '../auth/auth.module';
import { ClinicDocumentSetting } from '../entites/clinic-document-setting.entity';
import { PdfService } from '../shared/pdf/pdf.service';

@Module({
  imports : [
    TypeOrmModule.forFeature([
      ClinicDocumentSetting,
      TransactionMedicalCertificate
    ]),
    HelperModule,
    AuthModule
  ],
  controllers: [TransactionMedicalCertificateController],
  providers: [TransactionMedicalCertificateService, PdfService],
})
export class TransactionMedicalCertificateModule {}
