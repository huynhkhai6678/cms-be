import { Test, TestingModule } from '@nestjs/testing';
import { MedicineInventoryUsagesController } from './medicine-inventory-usages.controller';
import { MedicineInventoryUsagesService } from './medicine-inventory-usages.service';

describe('MedicineInventoryUsagesController', () => {
  let controller: MedicineInventoryUsagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicineInventoryUsagesController],
      providers: [MedicineInventoryUsagesService],
    }).compile();

    controller = module.get<MedicineInventoryUsagesController>(
      MedicineInventoryUsagesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
