import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, NotFoundException } from '@nestjs/common';
import { EnquiriesService } from './enquiries.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';
import { I18nService } from 'nestjs-i18n';

@Controller('enquiries')
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService, private i18n: I18nService ) {}

  @Post()
  async create(@Body(new ValidationPipe()) createEnquiryDto: CreateEnquiryDto) {
    let result = await this.enquiriesService.create(createEnquiryDto);
    if (!result) {
      throw new NotFoundException('Error');
    }

    return {
      message: await this.i18n.t('main.messages.flash.enquiry_sent'),
    };
  }

  @Get()
  findAll() {
    return this.enquiriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enquiriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEnquiryDto: UpdateEnquiryDto) {
    return this.enquiriesService.update(+id, updateEnquiryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enquiriesService.remove(+id);
  }
}
