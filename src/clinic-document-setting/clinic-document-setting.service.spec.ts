import { Test, TestingModule } from '@nestjs/testing';
import { ClinicDocumentSettingService } from './clinic-document-setting.service';

describe('ClinicDocumentSettingService', () => {
  let service: ClinicDocumentSettingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClinicDocumentSettingService],
    }).compile();

    service = module.get<ClinicDocumentSettingService>(
      ClinicDocumentSettingService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
