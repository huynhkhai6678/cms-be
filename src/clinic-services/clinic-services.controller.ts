import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ClinicServicesService } from './clinic-services.service';
import { CreateClinicServiceDto } from './dto/create-clinic-service.dto';
import { UpdateClinicServiceDto } from './dto/update-clinic-service.dto';
import { I18nService } from 'nestjs-i18n';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuardFactory } from '../guards/role.guard.factory';

@UseGuards(AuthGuard, RoleGuardFactory('manage_clinic_service'))
@Controller('clinic-services')
export class ClinicServicesController {
  constructor(
    private readonly clinicServicesService: ClinicServicesService,
    private i18n: I18nService,
  ) {}

  @Post()
  create(
    @Body(new ValidationPipe()) createClinicServiceDto: CreateClinicServiceDto,
  ) {
    return this.clinicServicesService.create(createClinicServiceDto);
  }

  @Get()
  async findAll(@Req() request, @Query() query) {
    if (!query.active) {
      query.active = 1;
    }
    return this.clinicServicesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.clinicServicesService.findOne(+id);
  }

  @Post('/update-active/:id')
  updateActive(@Param('id') id: number, @Body('active') active: boolean) {
    return this.clinicServicesService.updateActive(+id, active);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body(new ValidationPipe()) updateClinicServiceDto: UpdateClinicServiceDto,
  ) {
    const result = this.clinicServicesService.update(
      +id,
      updateClinicServiceDto,
    );
    if (!result) {
      throw new BadRequestException('Error when update');
    }

    return {
      message: this.i18n.t('main.messages.flash.clinic_service_update'),
    };
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    this.clinicServicesService.remove(+id);
    return {
      message: this.i18n.t('main.messages.flash.clinic_service_delete'),
    };
  }
}
