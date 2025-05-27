import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { DoctorHolidaysService } from './doctor-holidays.service';
import { CreateDoctorHolidayDto } from './dto/create-doctor-holiday.dto';
import { UpdateDoctorHolidayDto } from './dto/update-doctor-holiday.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuardFactory } from '../guards/role.guard.factory';

@UseGuards(AuthGuard, RoleGuardFactory('manage_doctors'))
@Controller('doctor-holidays')
export class DoctorHolidaysController {
  constructor(private readonly doctorHolidaysService: DoctorHolidaysService) {}

  @Post()
  create(@Body(new ValidationPipe()) createDoctorHolidayDto: CreateDoctorHolidayDto) {
    return this.doctorHolidaysService.create(createDoctorHolidayDto);
  }

  @Get()
  findAll(@Query() query) {
    return this.doctorHolidaysService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const user = req['user'];
    return this.doctorHolidaysService.findOne(+id, user.clinic_id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(new ValidationPipe()) updateDoctorHolidayDto: UpdateDoctorHolidayDto) {
    return this.doctorHolidaysService.update(+id, updateDoctorHolidayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorHolidaysService.remove(+id);
  }
}
