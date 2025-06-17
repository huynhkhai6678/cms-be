import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  Req,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuardFactory } from '../guards/role.guard.factory';
import { I18nService } from 'nestjs-i18n';
import { User } from '../entites/user.entity';
import { QueryParamsDto } from '../shared/dto/query-params.dto';

@UseGuards(AuthGuard, RoleGuardFactory('manage_appointments'))
@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    private i18n: I18nService,
  ) {}

  @Post()
  async create(
    @Body(ValidationPipe) createAppointmentDto: CreateAppointmentDto,
  ) {
    await this.appointmentsService.create(createAppointmentDto);
    return {
      message: this.i18n.t('main.messages.flash.appointment_create'),
    };
  }

  @Get()
  findAll(@Query() query : QueryParamsDto) {
    return this.appointmentsService.findAll(query);
  }

  @Get('calendar/:id')
  async findAllCalendar(@Param('id', ParseIntPipe) id: string, @Req() request: any) {
    const user: User = request.user;
    const data = await this.appointmentsService.findAllCalendar(+id, user);
    return {
      data,
    };
  }

  @Get(':id/:clinicId')
  findOne(@Param('id', ParseIntPipe) id: number, @Param('clinicId') clinicId: number) {
    return this.appointmentsService.findOne(id, clinicId);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body(ValidationPipe) updateAppointmentDto: UpdateAppointmentDto,
  ) {
    await this.appointmentsService.update(+id, updateAppointmentDto);
    return {
      message: this.i18n.t('main.messages.flash.appointment_update'),
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: string) {
    await this.appointmentsService.remove(+id);
    return {
      message: this.i18n.t('main.messages.flash.appointment_delete'),
    };
  }
}
