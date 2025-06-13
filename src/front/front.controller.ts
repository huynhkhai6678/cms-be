import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { FrontService } from './front.service';

@Controller('fronts')
export class FrontController {
  constructor(private readonly frontService: FrontService) {}

  @Get()
  findAll(@Query() query) {
    return this.frontService.getSettings(query);
  }

  @Get('service-counters/:id')
  getServiceCounter(@Param('id', ParseIntPipe) id: number) {
    return this.frontService.getServiceCounter(id);
  }

  @Get('services/:id')
  getServices(@Param('id', ParseIntPipe) id: number) {
    return this.frontService.getServices(id);
  }

  @Get('doctors/:id')
  getDoctors(@Param('id', ParseIntPipe) id: number) {
    return this.frontService.getDoctors(id);
  }

  @Get('top-doctors/:id')
  getTopDoctors(@Param('id', ParseIntPipe) id: number) {
    return this.frontService.getTopDoctors(id);
  }

  @Get('testimonials/:id')
  getFrontTestimonials(@Param('id', ParseIntPipe) id: number) {
    return this.frontService.getFrontTestimonials(id);
  }

  @Get('landing/:id')
  getLanding(@Param('id', ParseIntPipe) id: number) {
    return this.frontService.getLanding(id);
  }
}
