import { Test, TestingModule } from '@nestjs/testing';
import { DoctorHolidaysController } from './doctor-holidays.controller';
import { DoctorHolidaysService } from './doctor-holidays.service';

describe('DoctorHolidaysController', () => {
  let controller: DoctorHolidaysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctorHolidaysController],
      providers: [DoctorHolidaysService],
    }).compile();

    controller = module.get<DoctorHolidaysController>(DoctorHolidaysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
