import { Test, TestingModule } from '@nestjs/testing';
import { MedicineInventoryUsagesService } from './medicine-inventory-usages.service';

describe('MedicineInventoryUsagesService', () => {
  let service: MedicineInventoryUsagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicineInventoryUsagesService],
    }).compile();

    service = module.get<MedicineInventoryUsagesService>(MedicineInventoryUsagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
