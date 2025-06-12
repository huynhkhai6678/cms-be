import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ValidationPipe, ParseIntPipe, Req } from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { RoleGuardFactory } from '../../guards/role.guard.factory';
import { MedicalRecordService } from '../medical-record/medical-record.service';
import { WeightService } from './weight.service';
import { CreateWeightDto } from './dto/create-weight.dto';
import { UpdateWeightDto } from './dto/update-weight.dto';

@UseGuards(AuthGuard, RoleGuardFactory('manage_patients'))
@Controller('medical-record-weight')
export class WeightController {
  constructor(private readonly weightService: WeightService, private readonly medicalRecordService: MedicalRecordService) {}

  @Post()
  async create(@Body(ValidationPipe) createBloodPressureDto: CreateWeightDto, @Req() request : any) {
    const bloodPressure = await this.weightService.create(createBloodPressureDto);
    const data = `Weight : ${bloodPressure.weight}`;
    await this.medicalRecordService.addHistory(request.user.id, bloodPressure.patient_medical_record_id, data);
  }

  @Get('all/:id')
  findAll(@Param('id', ParseIntPipe) id: number, @Query() query : any) {
    return this.weightService.findAll(id, query);
  }

  @Get('chart/:id')
  findChart(@Param('id', ParseIntPipe) id: number) {
    return this.weightService.findChart(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.weightService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) updateBloodPressureDto: UpdateWeightDto) {
    return this.weightService.update(+id, updateBloodPressureDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.weightService.remove(+id);
  }
}
