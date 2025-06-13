import { Test, TestingModule } from '@nestjs/testing';
import { MedicinePurchaseController } from './medicine-purchase.controller';
import { MedicinePurchaseService } from './medicine-purchase.service';

describe('MedicinePurchaseController', () => {
  let controller: MedicinePurchaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicinePurchaseController],
      providers: [MedicinePurchaseService],
    }).compile();

    controller = module.get<MedicinePurchaseController>(
      MedicinePurchaseController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
