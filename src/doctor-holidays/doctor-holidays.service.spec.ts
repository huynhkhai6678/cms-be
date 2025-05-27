import { Test, TestingModule } from '@nestjs/testing';
import { DoctorHolidaysService } from './doctor-holidays.service';

describe('DoctorHolidaysService', () => {
  let service: DoctorHolidaysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoctorHolidaysService],
    }).compile();

    service = module.get<DoctorHolidaysService>(DoctorHolidaysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
