import { Test, TestingModule } from '@nestjs/testing';
import { BloodPressureController } from './blood-pressure.controller';
import { BloodPressureService } from './blood-pressure.service';

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
