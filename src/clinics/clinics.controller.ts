import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';
import { ClinicsService } from './clinics.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuardFactory } from '../guards/role.guard.factory';
import { I18nService } from 'nestjs-i18n';

@Controller('clinics')
@UseGuards(AuthGuard, RoleGuardFactory('manage_clinics'))
export class ClinicsController {
  constructor(
    private readonly clinicsService: ClinicsService,
    private i18n: I18nService,
  ) {}

  @Post()
  async create(@Body(new ValidationPipe()) createClinicDto: CreateClinicDto) {
    const result = this.clinicsService.create(createClinicDto);
    if (!result) {
      throw new BadRequestException('Error');
    }

    return {
      message: await this.i18n.t('main.messages.flash.clinic_create'),
    };
  }

  @Get()
  async findAll(@Query() query) {
    return this.clinicsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clinicsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateClinicDto: UpdateClinicDto,
  ) {
    const result = this.clinicsService.update(+id, updateClinicDto);
    if (!result) {
      throw new BadRequestException('Error');
    }

    return {
      message: await this.i18n.t('main.messages.flash.clinic_create'),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.clinicsService.remove(+id);
    return {
      message: await this.i18n.t('main.messages.flash.role_delete'),
    };
  }
}
