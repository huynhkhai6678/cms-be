import { Test, TestingModule } from '@nestjs/testing';
import { ClinicSchedulesService } from './clinic-schedules.service';

describe('ClinicSchedulesService', () => {
  let service: ClinicSchedulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClinicSchedulesService],
    }).compile();

    service = module.get<ClinicSchedulesService>(ClinicSchedulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
