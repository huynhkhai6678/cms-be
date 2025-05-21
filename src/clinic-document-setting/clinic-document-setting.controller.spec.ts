import { Test, TestingModule } from '@nestjs/testing';
import { ClinicDocumentSettingController } from './clinic-document-setting.controller';
import { ClinicDocumentSettingService } from './clinic-document-setting.service';

describe('ClinicDocumentSettingController', () => {
  let controller: ClinicDocumentSettingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClinicDocumentSettingController],
      providers: [ClinicDocumentSettingService],
    }).compile();

    controller = module.get<ClinicDocumentSettingController>(ClinicDocumentSettingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
