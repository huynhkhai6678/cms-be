import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { ClinicDocumentSettingService } from './clinic-document-setting.service';
import { UpdateClinicDocumentSettingDto } from './dto/update-clinic-document-setting.dto';
import { UploadImageDto } from './dto/upload-image.dto';

@Controller('clinic-document-setting')
export class ClinicDocumentSettingController {
  constructor(
    private readonly clinicDocumentSettingService: ClinicDocumentSettingService,
  ) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clinicDocumentSettingService.findOne(+id);
  }

  @Post('upload-image')
  uploadImmage(uploadImageDto: UploadImageDto) {
    const result =
      this.clinicDocumentSettingService.uploadImage(uploadImageDto);
    return {
      data: result,
    };
  }

  @Post(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe())
    updateClinicDocumentSettingDto: UpdateClinicDocumentSettingDto,
  ) {
    const result = await this.clinicDocumentSettingService.update(
      +id,
      updateClinicDocumentSettingDto,
    );
    return {
      data: result,
    };
  }
}
