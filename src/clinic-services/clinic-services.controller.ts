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
  ParseIntPipe,
} from '@nestjs/common';
import { ClinicServicesService } from './clinic-services.service';
import { CreateClinicServiceDto } from './dto/create-clinic-service.dto';
import { UpdateClinicServiceDto } from './dto/update-clinic-service.dto';
import { I18nService } from 'nestjs-i18n';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuardFactory } from '../guards/role.guard.factory';
import { QueryParamsDto } from 'src/shared/dto/query-params.dto';

@UseGuards(AuthGuard, RoleGuardFactory('manage_clinic_service'))
@Controller('clinic-services')
export class ClinicServicesController {
  constructor(
    private readonly clinicServicesService: ClinicServicesService,
    private i18n: I18nService,
  ) {}

  @Post()
  create(@Body(ValidationPipe) createClinicServiceDto: CreateClinicServiceDto) {
    return this.clinicServicesService.create(createClinicServiceDto);
  }

  @Get()
  async findAll(@Query() query: QueryParamsDto) {
    if (!query.active) {
      query.active = 1;
    }
    return this.clinicServicesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clinicServicesService.findOne(+id);
  }

  @Post('/update-active/:id')
  updateActive(
    @Param('id', ParseIntPipe) id: number,
    @Body('active') active: boolean,
  ) {
    return this.clinicServicesService.updateActive(+id, active);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateClinicServiceDto: UpdateClinicServiceDto,
  ) {
    const result = await this.clinicServicesService.update(
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
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.clinicServicesService.remove(+id);
    return {
      message: this.i18n.t('main.messages.flash.clinic_service_delete'),
    };
  }
}
