import { Test, TestingModule } from '@nestjs/testing';
import { MedicineInventoriesService } from './medicine-inventories.service';

describe('MedicineInventoriesService', () => {
  let service: MedicineInventoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicineInventoriesService],
    }).compile();

    service = module.get<MedicineInventoriesService>(MedicineInventoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
