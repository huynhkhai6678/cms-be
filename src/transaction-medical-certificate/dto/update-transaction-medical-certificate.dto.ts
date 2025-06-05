import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionMedicalCertificateDto } from './create-transaction-medical-certificate.dto';

export class UpdateTransactionMedicalCertificateDto extends PartialType(CreateTransactionMedicalCertificateDto) {}
