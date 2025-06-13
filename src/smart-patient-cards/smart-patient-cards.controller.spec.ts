import { Test, TestingModule } from '@nestjs/testing';
import { SmartPatientCardsController } from './smart-patient-cards.controller';
import { SmartPatientCardsService } from './smart-patient-cards.service';

describe('SmartPatientCardsController', () => {
  let controller: SmartPatientCardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SmartPatientCardsController],
      providers: [SmartPatientCardsService],
    }).compile();

    controller = module.get<SmartPatientCardsController>(
      SmartPatientCardsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
