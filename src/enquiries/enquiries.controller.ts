import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ValidationPipe,
  NotFoundException,
  Query,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { EnquiriesService } from './enquiries.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { I18nService } from 'nestjs-i18n';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuardFactory } from '../guards/role.guard.factory';

@UseGuards(AuthGuard, RoleGuardFactory('manage_front_cms'))
@Controller('enquiries')
export class EnquiriesController {
  constructor(
    private readonly enquiriesService: EnquiriesService,
    private i18n: I18nService,
  ) {}

  @Post()
  async create(@Body(ValidationPipe) createEnquiryDto: CreateEnquiryDto) {
    const result = await this.enquiriesService.create(createEnquiryDto);
    if (!result) {
      throw new NotFoundException('Error');
    }

    return {
      message: this.i18n.t('main.messages.flash.enquiry_sent'),
    };
  }

  @Get()
  findAll(@Req() request, @Query() query) {
    const user = request.user;
    if (!query.clinic_id) {
      query.clinic_id = user.clinic_id;
    }
    return this.enquiriesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.enquiriesService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: string) {
    await this.enquiriesService.remove(+id);
    return {
      message: this.i18n.t('main.messages.flash.enquiry_delete'),
    };
  }
}
