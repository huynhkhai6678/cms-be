import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(@Body(new ValidationPipe()) createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get('calendar/:id')
  async findAllCalendar(@Param('id') id: string) {
    const data = await this.appointmentsService.findAllCalendar(+id);
    return {
      data
    }
  }

  @Get(':id/:clinicId')
  findOne(@Param('id') id: number, @Param('clinicId') clinicId: number) {
    return this.appointmentsService.findOne(id, clinicId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(new ValidationPipe()) updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentsService.update(+id, updateAppointmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(+id);
  }
}
