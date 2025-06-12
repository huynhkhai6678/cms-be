import { Test, TestingModule } from '@nestjs/testing';
import { BloodPressureController } from './pulse-rate.controller';
import { BloodPressureService } from './pulse-rate.service';

describe('BloodPressureController', () => {
  let controller: BloodPressureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BloodPressureController],
      providers: [BloodPressureService],
    }).compile();

    controller = module.get<BloodPressureController>(BloodPressureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
