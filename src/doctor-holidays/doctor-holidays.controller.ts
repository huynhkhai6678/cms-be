import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { DoctorHolidaysService } from './doctor-holidays.service';
import { CreateDoctorHolidayDto } from './dto/create-doctor-holiday.dto';
import { UpdateDoctorHolidayDto } from './dto/update-doctor-holiday.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuardFactory } from '../guards/role.guard.factory';
import { QueryParamsDto } from '../shared/dto/query-params.dto';
import { User } from '../entites/user.entity';

@UseGuards(AuthGuard, RoleGuardFactory('manage_doctors'))
@Controller('doctor-holidays')
export class DoctorHolidaysController {
  constructor(private readonly doctorHolidaysService: DoctorHolidaysService) {}

  @Post()
  create(@Body(ValidationPipe) createDoctorHolidayDto: CreateDoctorHolidayDto) {
    return this.doctorHolidaysService.create(createDoctorHolidayDto);
  }

  @Get()
  findAll(@Query() query: QueryParamsDto) {
    return this.doctorHolidaysService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string, @Req() req) {
    const user: User = req['user'];
    return this.doctorHolidaysService.findOne(+id, user.clinic_id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateDoctorHolidayDto: UpdateDoctorHolidayDto,
  ) {
    return this.doctorHolidaysService.update(+id, updateDoctorHolidayDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.doctorHolidaysService.remove(+id);
  }
}
