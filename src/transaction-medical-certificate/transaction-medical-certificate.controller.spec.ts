import { Test, TestingModule } from '@nestjs/testing';
import { TransactionMedicalCertificateController } from './transaction-medical-certificate.controller';
import { TransactionMedicalCertificateService } from './transaction-medical-certificate.service';

describe('TransactionMedicalCertificateController', () => {
  let controller: TransactionMedicalCertificateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionMedicalCertificateController],
      providers: [TransactionMedicalCertificateService],
    }).compile();

    controller = module.get<TransactionMedicalCertificateController>(TransactionMedicalCertificateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
