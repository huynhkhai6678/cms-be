import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  ValidationPipe,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuardFactory } from '../guards/role.guard.factory';
import { FileInterceptor } from '@nestjs/platform-express';
import { createFileUploadStorage } from '../utils/upload-file.util';
import { fileFilter } from '../utils/file-util';
import { I18nService } from 'nestjs-i18n';
import { QueryParamsDto } from '../shared/dto/query-params.dto';
import { NotificationService } from '../notification/notification.service';

@UseGuards(AuthGuard, RoleGuardFactory('manage_patients'))
@Controller('patients')
export class PatientsController {
  constructor(
    private readonly patientsService: PatientsService,
    private readonly notificationService: NotificationService,
    private i18n: I18nService,
  ) {}

  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: createFileUploadStorage('users'),
      fileFilter,
    }),
  )
  @Post()
  async create(
    @UploadedFile() avatar: Express.Multer.File,
    @Req() req: any,
    @Body(ValidationPipe) createPatientDto: CreatePatientDto,
  ) {
    const clinicId = createPatientDto.clinic_id || req['user'].clinic_id;
    let imageUrl = '';
    if (avatar) {
      imageUrl = `public/uploads/${clinicId}/users/${avatar.filename}`;
    }
    await this.patientsService.create(createPatientDto, imageUrl);
    return {
      message: this.i18n.translate('main.messages.flash.patient_create'),
    };
  }

  @Get()
  async findAll(@Query() query: QueryParamsDto) {
    return this.patientsService.findAll(query);
  }

  @Get('detail/:id')
  findDetail(@Param('id', ParseIntPipe) id: number) {
    return this.patientsService.findDetail(id);
  }

  @Get('appointments/:id')
  findAppointment(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: QueryParamsDto,
  ) {
    return this.patientsService.findAppointment(id, query);
  }

  @Get(':id/:clinicId')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Param('clinicId', ParseIntPipe) clinicId: number,
  ) {
    return this.patientsService.findOne(id, clinicId);
  }

  @Post(':id')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: createFileUploadStorage('users'),
      fileFilter,
    }),
  )
  async update(
    @UploadedFile() avatar: Express.Multer.File,
    @Req() req: any,
    @Param('id', ParseIntPipe) id: string,
    @Body(
      new ValidationPipe({
        whitelist: true,
        skipMissingProperties: true,
      }),
    )
    updatePatientDto: UpdatePatientDto,
  ) {
    const clinicId = updatePatientDto.clinic_id || req['user'].clinic_id;
    let imageUrl = '';
    if (avatar) {
      imageUrl = `public/uploads/${clinicId}/users/${avatar.filename}`;
    }
    await this.patientsService.update(+id, updatePatientDto, imageUrl);
    return {
      message: this.i18n.translate('main.messages.flash.patient_update'),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.patientsService.remove(+id);
    return {
      message: this.i18n.translate('main.messages.flash.patient_delete'),
    };
  }
}
