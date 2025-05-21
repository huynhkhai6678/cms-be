import { Test, TestingModule } from '@nestjs/testing';
import { ClinicSchedulesController } from './clinic-schedules.controller';
import { ClinicSchedulesService } from './clinic-schedules.service';

describe('ClinicSchedulesController', () => {
  let controller: ClinicSchedulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClinicSchedulesController],
      providers: [ClinicSchedulesService],
    }).compile();

    controller = module.get<ClinicSchedulesController>(ClinicSchedulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
