import { Test, TestingModule } from '@nestjs/testing';
import { ClinicChainsService } from './clinic-chains.service';

describe('ClinicChainsService', () => {
  let service: ClinicChainsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClinicChainsService],
    }).compile();

    service = module.get<ClinicChainsService>(ClinicChainsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
