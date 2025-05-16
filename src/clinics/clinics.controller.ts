import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ClinicsService } from './clinics.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuardFactory } from '../guards/role.guard.factory';

@Controller('clinics')
@UseGuards(AuthGuard, RoleGuardFactory('manage_clinics'))
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Post()
  create(@Body() createClinicDto: CreateClinicDto) {
    return this.clinicsService.create(createClinicDto);
  }

  @Get()
  async findAll(@Query() query) {
    return this.clinicsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clinicsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClinicDto: UpdateClinicDto) {
    return this.clinicsService.update(+id, updateClinicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clinicsService.remove(+id);
  }
}
