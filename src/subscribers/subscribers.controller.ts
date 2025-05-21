import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Query } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { I18nService } from 'nestjs-i18n';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService, private i18n: I18nService) {}

  @Post()
  create(@Body(new ValidationPipe()) createSubscriberDto: CreateSubscriberDto) {
    return this.subscribersService.create(createSubscriberDto);
  }

  @Get()
  findAll(@Query() query) {
    return this.subscribersService.findAll(query);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.subscribersService.remove(+id);
    return {
      message: await this.i18n.t('main.messages.flash.subscribe_delete'),
    };
  }
}
