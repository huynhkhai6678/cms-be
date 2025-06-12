import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module';
import { PatientMedicalRecordDocument } from '../../entites/patient-medical-record-document.entity';
import { PatientMedicalRecord } from '../../entites/patient-medical-record.entity';
import { FileServiceModule } from 'src/shared/file/file.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PatientMedicalRecordDocument, PatientMedicalRecord]),
    AuthModule,
    FileServiceModule
  ],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
