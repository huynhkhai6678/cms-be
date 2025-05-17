import { Test, TestingModule } from '@nestjs/testing';
import { SpecilizationsService } from './specilizations.service';

describe('SpecilizationsService', () => {
  let service: SpecilizationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpecilizationsService],
    }).compile();

    service = module.get<SpecilizationsService>(SpecilizationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
