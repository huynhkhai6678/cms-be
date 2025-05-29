import { Test, TestingModule } from '@nestjs/testing';
import { SmartPatientCardsService } from './smart-patient-cards.service';

describe('SmartPatientCardsService', () => {
  let service: SmartPatientCardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmartPatientCardsService],
    }).compile();

    service = module.get<SmartPatientCardsService>(SmartPatientCardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
