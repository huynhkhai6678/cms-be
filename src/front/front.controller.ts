import { Controller } from '@nestjs/common';
import { FrontService } from './front.service';

@Controller('front')
export class FrontController {
  constructor(private readonly frontService: FrontService) {
    
  }
}
