import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  NotFoundException,
  Query,
  Req,
  UseGuards,
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
  async create(@Body(new ValidationPipe()) createEnquiryDto: CreateEnquiryDto) {
    const result = await this.enquiriesService.create(createEnquiryDto);
    if (!result) {
      throw new NotFoundException('Error');
    }

    return {
      message: await this.i18n.t('main.messages.flash.enquiry_sent'),
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
  findOne(@Param('id') id: number) {
    return this.enquiriesService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.enquiriesService.remove(+id);
    return {
      message: await this.i18n.t('main.messages.flash.enquiry_delete'),
    };
  }
}
