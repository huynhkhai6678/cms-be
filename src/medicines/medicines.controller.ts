import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ValidationPipe, UseInterceptors, Req, UploadedFile } from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuardFactory } from '../guards/role.guard.factory';
import { I18nService } from 'nestjs-i18n';
import { FileInterceptor } from '@nestjs/platform-express';
import { createFileUploadStorage } from '../utils/upload-file.util';
import { fileFilter } from '../utils/file-util';

@UseGuards(AuthGuard, RoleGuardFactory('manage_medicines'))
@Controller('medicines')
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService, private i18n : I18nService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: createFileUploadStorage('medicines'),
      fileFilter,
    }),
  )
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Req() req: any,
    @Body(new ValidationPipe()) createMedicineDto: CreateMedicineDto
  ) {
    const clinicIds = createMedicineDto.clinic_ids.split(',');
    for (const clinicId of clinicIds) {
      let imageUrl = '';
      if (image) {
        imageUrl = `public/uploads/${clinicId}/medicines/${image.filename}`;
        createMedicineDto.inventory_image = imageUrl;
      }
      await this.medicinesService.create(createMedicineDto);
    }
  }

  @Get()
  findAll(@Query() query) {
    return this.medicinesService.findAll(query);
  }

  @Get('form-selection/:id')
  getSelection(@Param('id') clinicId: string) {
    return this.medicinesService.getFormSelection(+clinicId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicinesService.findOne(+id);
  }

  @Post('update-status/:id')
  async updateStatus(@Param('id') id: string, @Body('active') active : boolean) {
    await this.medicinesService.updateStatus(+id, active);
    return {
      message: this.i18n.translate('main.messages.flash.update_status'),
    };
  }

  @Post(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: createFileUploadStorage('medicines'),
      fileFilter,
    }),
  )
  update(
    @UploadedFile() image: Express.Multer.File,
    @Req() req: any,
    @Param('id') id: string, @Body(new ValidationPipe()) updateMedicineDto: UpdateMedicineDto
  ) {
    const clinicId = updateMedicineDto.clinic_id || req['user'].clinic_id;
    let imageUrl = '';
    if (image) {
      imageUrl = `public/uploads/${clinicId}/medicines/${image.filename}`;
      updateMedicineDto.inventory_image = imageUrl;
    }
    return this.medicinesService.update(+id, updateMedicineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicinesService.remove(+id);
  }
}
