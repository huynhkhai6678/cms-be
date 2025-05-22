import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import { CmsService } from './cms.service';
import { UpdateCmDto } from './dto/update-cm.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuardFactory } from '../guards/role.guard.factory';
import { I18nService } from 'nestjs-i18n';
import { createFileUploadStorage } from 'src/utils/upload-file.util';
import { fileFilter } from 'src/utils/file-util';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard, RoleGuardFactory('manage_front_cms'))
@Controller('cms')
export class CmsController {
  constructor(
    private readonly cmsService: CmsService,
    private i18n: I18nService,
  ) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cmsService.findOne(+id);
  }

  @Post(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'about_image_1', maxCount: 1 },
        { name: 'about_image_2', maxCount: 1 },
        { name: 'about_image_3', maxCount: 1 },
      ],
      {
        storage: createFileUploadStorage('settings'),
        fileFilter,
      },
    ),
  )
  async update(
    @UploadedFiles()
    files: {
      about_image_1?: Express.Multer.File[];
      about_image_2?: Express.Multer.File[];
      about_image_3?: Express.Multer.File[];
    },
    @Req() req,
    @Param('id') id: string,
    @Body() updateCmDto: UpdateCmDto,
  ) {
    if (files) {
      if (files.about_image_1) {
        updateCmDto.about_image_1 = `public/uploads/${id}/settings/${files.about_image_1[0].filename}`;
      }

      if (files.about_image_2) {
        updateCmDto.about_image_2 = `public/uploads/${id}/settings/${files.about_image_2[0].filename}`;
      }

      if (files.about_image_3) {
        updateCmDto.about_image_3 = `public/uploads/${id}/settings/${files.about_image_3[0].filename}`;
      }
    }

    this.cmsService.update(+id, updateCmDto);
    return {
      message: await this.i18n.t('main.messages.flash.cms_update'),
    };
  }
}
