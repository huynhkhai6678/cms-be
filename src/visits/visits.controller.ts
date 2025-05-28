import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ValidationPipe, Req } from '@nestjs/common';
import { VisitsService } from './visits.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuardFactory } from '../guards/role.guard.factory';
import { I18nService } from 'nestjs-i18n';

@UseGuards(AuthGuard, RoleGuardFactory('manage_patient_visits'))
@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService, private i18n: I18nService) {}

  @Post()
  async create(@Body(new ValidationPipe()) createVisitDto: CreateVisitDto) {
    await this.visitsService.create(createVisitDto);
    return {
      message: this.i18n.t('main.messages.flash.visit_create'),
    };
  }

  @Get()
  findAll(@Query() query) {
    return this.visitsService.findAll(query);
  }

  @Get(':id/:clinicId')
  findOne(@Param('id') id: number, @Param('clinicId') clinicId: number) {
    return this.visitsService.findOne(id, clinicId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body(new ValidationPipe()) updateVisitDto: UpdateVisitDto) {
    await this.visitsService.update(+id, updateVisitDto);
    return {
      message: this.i18n.t('main.messages.flash.visit_update'),
    };
  }

  @Post('update-status/:id')
  async updateStatus(@Param('id') id: string, @Body('status') status : number) {
    await this.visitsService.updateStatus(+id, status);
    return {
      message: this.i18n.t('main.messages.flash.update_status'),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.visitsService.remove(+id);
    return {
      message: this.i18n.t('main.messages.flash.visit_delete'),
    };
  }
}
