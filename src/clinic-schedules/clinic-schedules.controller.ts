import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ClinicSchedulesService } from './clinic-schedules.service';
import { UpdateClinicScheduleDto } from './dto/update-clinic-schedule.dto';
import { I18nService } from 'nestjs-i18n';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuardFactory } from '../guards/role.guard.factory';

@UseGuards(AuthGuard, RoleGuardFactory('manage_settings'))
@Controller('clinic-schedules')
export class ClinicSchedulesController {
  constructor(
    private readonly clinicSchedulesService: ClinicSchedulesService,
    private i18n: I18nService,
  ) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.clinicSchedulesService.findOne(+id);
  }

  @Post(':id')
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateClinicScheduleDto: UpdateClinicScheduleDto,
  ) {
    const result = await this.clinicSchedulesService.update(
      +id,
      updateClinicScheduleDto,
    );
    if (!result) {
      throw new BadRequestException(`Can't update data`);
    }

    return {
      message: this.i18n.t('main.messages.flash.clinic_save'),
    };
  }

  @Post('check-record/:id')
  @HttpCode(HttpStatus.OK)
  checkRecord(
    @Param('id') id: string,
    @Body() updateClinicScheduleDto: UpdateClinicScheduleDto,
  ) {
    return this.clinicSchedulesService.checkRecord(
      +id,
      updateClinicScheduleDto,
    );
  }
}
