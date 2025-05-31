import { Test, TestingModule } from '@nestjs/testing';
import { MedicineInventoriesController } from './medicine-inventories.controller';
import { MedicineInventoriesService } from './medicine-inventories.service';

describe('MedicineInventoriesController', () => {
  let controller: MedicineInventoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicineInventoriesController],
      providers: [MedicineInventoriesService],
    }).compile();

    controller = module.get<MedicineInventoriesController>(MedicineInventoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
