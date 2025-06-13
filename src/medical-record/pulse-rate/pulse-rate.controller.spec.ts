import { Test, TestingModule } from '@nestjs/testing';
import { PulseRateController } from './pulse-rate.controller';
import { PulseRateService } from './pulse-rate.service';

describe('PulseRateController', () => {
  let controller: PulseRateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PulseRateController],
      providers: [PulseRateService],
    }).compile();

    controller = module.get<PulseRateController>(PulseRateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
