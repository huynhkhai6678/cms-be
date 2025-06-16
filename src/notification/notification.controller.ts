import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ValidationPipe,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { AuthGuard } from '../guards/auth.guard';
import { NotificationService } from './notification.service';
import { User } from 'src/entites/user.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

@UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private i18n: I18nService,
  ) {}

  @Post()
  async create(@Body(ValidationPipe) createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }


  @Get()
  findAll(@Req() request: any) {
    const user : User = request.user;
    return this.notificationService.findAll(user.id);
  }

  @Get('read/:id')
  readOne(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.readOne(+id);
  }

  @Get('read-all')
  readAll(@Req() request: any) {
    const user : User = request.user;
    return this.notificationService.readAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: string) {
    await this.notificationService.remove(+id);
    return {
      message: this.i18n.t('main.messages.flash.enquiry_delete'),
    };
  }
}