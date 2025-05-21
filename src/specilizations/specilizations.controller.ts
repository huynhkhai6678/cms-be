import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ValidationPipe, BadRequestException } from '@nestjs/common';
import { SpecilizationsService } from './specilizations.service';
import { CreateSpecilizationDto } from './dto/create-specilization.dto';
import { UpdateSpecilizationDto } from './dto/update-specilization.dto';
import { I18nService } from 'nestjs-i18n';

@Controller('specializations')
export class SpecilizationsController {
  constructor(private readonly specilizationsService: SpecilizationsService, private i18n: I18nService) {}

  @Post()
  async create(@Body(new ValidationPipe()) createSpecilizationDto: CreateSpecilizationDto) {
    let result = await this.specilizationsService.create(createSpecilizationDto);
    if (!result) {
      throw new BadRequestException('Error');
    }

    return {
      message: await this.i18n.t('main.messages.flash.specialization_create'),
    };
  }

  @Get()
  findAll(@Query() query) {
    return this.specilizationsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.specilizationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSpecilizationDto: UpdateSpecilizationDto) {
    return this.specilizationsService.update(+id, updateSpecilizationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.specilizationsService.remove(+id);
    return {
      message: await this.i18n.t('main.messages.flash.specialization_delete'),
    };
  }
}
