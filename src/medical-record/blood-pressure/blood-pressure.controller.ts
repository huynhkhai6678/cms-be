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
import { BloodPressureService } from './blood-pressure.service';
import { CreateBloodPressureDto } from './dto/create-blood-pressure.dto';
import { UpdateBloodPressureDto } from './dto/update-blood-pressure.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { RoleGuardFactory } from '../../guards/role.guard.factory';
import { MedicalRecordService } from '../medical-record/medical-record.service';
import { User } from '../../entites/user.entity';

@UseGuards(AuthGuard, RoleGuardFactory('manage_patients'))
@Controller('medical-record-blood-pressure')
export class BloodPressureController {
  constructor(
    private readonly bloodPressureService: BloodPressureService,
    private readonly medicalRecordService: MedicalRecordService,
  ) {}

  @Post()
  async create(
    @Body(ValidationPipe) createBloodPressureDto: CreateBloodPressureDto,
    @Req() request: any,
  ) {
    const user: User = request.user;
    const bloodPressure = await this.bloodPressureService.create(
      createBloodPressureDto,
    );
    const data = `BP Systolic : ${bloodPressure.bp_systolic} BP Diastolic : ${bloodPressure.bp_diastolic}`;
    await this.medicalRecordService.addHistory(
      user.id,
      bloodPressure.patient_medical_record_id,
      data,
    );
  }

  @Get('all/:id')
  findAll(@Param('id', ParseIntPipe) id: number, @Query() query: any) {
    return this.bloodPressureService.findAll(id, query);
  }

  @Get('chart/:id')
  findChart(@Param('id', ParseIntPipe) id: number) {
    return this.bloodPressureService.findChart(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bloodPressureService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateBloodPressureDto: UpdateBloodPressureDto,
  ) {
    return this.bloodPressureService.update(+id, updateBloodPressureDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.bloodPressureService.remove(+id);
  }
}
