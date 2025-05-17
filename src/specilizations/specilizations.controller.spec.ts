import { Test, TestingModule } from '@nestjs/testing';
import { SpecilizationsController } from './specilizations.controller';
import { SpecilizationsService } from './specilizations.service';

describe('SpecilizationsController', () => {
  let controller: SpecilizationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecilizationsController],
      providers: [SpecilizationsService],
    }).compile();

    controller = module.get<SpecilizationsController>(SpecilizationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
