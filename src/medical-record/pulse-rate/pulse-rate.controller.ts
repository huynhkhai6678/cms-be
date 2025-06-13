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
import { PulseRateService } from './pulse-rate.service';
import { CreatePulseRateDto } from './dto/create-pulse-rate.dto';
import { UpdatePulseRateDto } from './dto/update-pulse-rate.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { RoleGuardFactory } from '../../guards/role.guard.factory';
import { MedicalRecordService } from '../medical-record/medical-record.service';
import { User } from '../../entites/user.entity';

@UseGuards(AuthGuard, RoleGuardFactory('manage_patients'))
@Controller('medical-record-pulse-rate')
export class PulseRateController {
  constructor(
    private readonly pulseRateService: PulseRateService,
    private readonly medicalRecordService: MedicalRecordService,
  ) {}

  @Post()
  async create(
    @Body(ValidationPipe) createPulseRateDto: CreatePulseRateDto,
    @Req() request: any,
  ) {
    const user: User = request.user;
    const pulseRate = await this.pulseRateService.create(createPulseRateDto);
    const data = `Pulse rate : ${pulseRate.pulse}`;
    await this.medicalRecordService.addHistory(
      user.id,
      pulseRate.patient_medical_record_id,
      data,
    );
  }

  @Get('all/:id')
  findAll(@Param('id', ParseIntPipe) id: number, @Query() query: any) {
    return this.pulseRateService.findAll(id, query);
  }

  @Get('chart/:id')
  findChart(@Param('id', ParseIntPipe) id: number) {
    return this.pulseRateService.findChart(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pulseRateService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updatePulseRateDto: UpdatePulseRateDto,
  ) {
    return this.pulseRateService.update(+id, updatePulseRateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.pulseRateService.remove(+id);
  }
}
