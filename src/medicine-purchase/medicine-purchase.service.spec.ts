import { Test, TestingModule } from '@nestjs/testing';
import { MedicinePurchaseService } from './medicine-purchase.service';

describe('MedicinePurchaseService', () => {
  let service: MedicinePurchaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicinePurchaseService],
    }).compile();

    service = module.get<MedicinePurchaseService>(MedicinePurchaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
