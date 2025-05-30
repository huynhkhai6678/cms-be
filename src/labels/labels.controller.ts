import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Query, UseGuards } from '@nestjs/common';
import { LabelsService } from './labels.service';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { I18nService } from 'nestjs-i18n';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuardFactory } from '../guards/role.guard.factory';

@UseGuards(AuthGuard, RoleGuardFactory('manage_medicines'))
@Controller('labels')
export class LabelsController {
  constructor(private readonly labelsService: LabelsService, private i18n : I18nService) {}

  @Post()
  create(@Body(new ValidationPipe()) createLabelDto: CreateLabelDto) {
    return this.labelsService.create(createLabelDto);
  }

  @Get()
  findAll(@Query() query) {
    return this.labelsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.labelsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(new ValidationPipe()) updateLabelDto: UpdateLabelDto) {
    return this.labelsService.update(+id, updateLabelDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.labelsService.remove(+id);
    return {
      message: this.i18n.translate('main.messages.flash.label_delete'),
    };
  }
}
