import { Test, TestingModule } from '@nestjs/testing';
import { TransactionMedicalCertificateService } from './transaction-medical-certificate.service';

describe('TransactionMedicalCertificateService', () => {
  let service: TransactionMedicalCertificateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionMedicalCertificateService],
    }).compile();

    service = module.get<TransactionMedicalCertificateService>(TransactionMedicalCertificateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
