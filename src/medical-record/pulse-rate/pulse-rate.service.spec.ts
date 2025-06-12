import { Test, TestingModule } from '@nestjs/testing';
import { PulseRateService } from './pulse-rate.service';

describe('BloodPressureService', () => {
  let service: PulseRateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PulseRateService],
    }).compile();

    service = module.get<PulseRateService>(PulseRateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
