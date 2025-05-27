import { Test, TestingModule } from '@nestjs/testing';
import { HelperController } from './helper.controller';
import { HelperService } from './helper.service';

describe('HelperController', () => {
  let controller: HelperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelperController],
      providers: [HelperService],
    }).compile();

    controller = module.get<HelperController>(HelperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
