import { Test, TestingModule } from '@nestjs/testing';
import { ClinicChainsController } from './clinic-chains.controller';
import { ClinicChainsService } from './clinic-chains.service';

describe('ClinicChainsController', () => {
  let controller: ClinicChainsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClinicChainsController],
      providers: [ClinicChainsService],
    }).compile();

    controller = module.get<ClinicChainsController>(ClinicChainsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
