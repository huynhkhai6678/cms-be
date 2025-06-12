import { Test, TestingModule } from '@nestjs/testing';
import { BloodPressureService } from './blood-pressure.service';

describe('BloodPressureService', () => {
  let service: BloodPressureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BloodPressureService],
    }).compile();

    service = module.get<BloodPressureService>(BloodPressureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
