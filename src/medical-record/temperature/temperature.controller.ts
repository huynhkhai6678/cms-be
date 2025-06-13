import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ValidationPipe,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { RoleGuardFactory } from '../../guards/role.guard.factory';
import { MedicalRecordService } from '../medical-record/medical-record.service';
import { CreateTemperatureDto } from './dto/create-temperature.dto';
import { TemperatureService } from './temperature.service';
import { UpdateTemperatureDto } from './dto/update-temperature.dto';
import { User } from '../../entites/user.entity';

@UseGuards(AuthGuard, RoleGuardFactory('manage_patients'))
@Controller('medical-record-temperature')
export class TemperatureController {
  constructor(
    private readonly temperatureService: TemperatureService,
    private readonly medicalRecordService: MedicalRecordService,
  ) {}

  @Post()
  async create(
    @Body(ValidationPipe) createBloodPressureDto: CreateTemperatureDto,
    @Req() request: any,
  ) {
    const user: User = request.user;
    const bloodPressure = await this.temperatureService.create(
      createBloodPressureDto,
    );
    const data = `Temparature : ${bloodPressure.temperature}`;
    await this.medicalRecordService.addHistory(
      user.id,
      bloodPressure.patient_medical_record_id,
      data,
    );
  }

  @Get('all/:id')
  findAll(@Param('id', ParseIntPipe) id: number, @Query() query: any) {
    return this.temperatureService.findAll(id, query);
  }

  @Get('chart/:id')
  findChart(@Param('id', ParseIntPipe) id: number) {
    return this.temperatureService.findChart(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.temperatureService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateTemperatureDto: UpdateTemperatureDto,
  ) {
    return this.temperatureService.update(+id, updateTemperatureDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.temperatureService.remove(+id);
  }
}
