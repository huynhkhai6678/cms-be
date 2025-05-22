import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { SlidersService } from './sliders.service';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuardFactory } from '../guards/role.guard.factory';
import { FileInterceptor } from '@nestjs/platform-express';
import { createFileUploadStorage } from '../utils/upload-file.util';
import { fileFilter } from '../utils/file-util';

@UseGuards(AuthGuard, RoleGuardFactory('manage_front_cms'))
@Controller('sliders')
export class SlidersController {
  constructor(private readonly slidersService: SlidersService) {}

  @Get()
  findAll(@Query() query) {
    return this.slidersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.slidersService.findOne(+id);
  }

  @Post(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: createFileUploadStorage('sliders'),
      fileFilter: fileFilter,
    }),
  )
  update(
    @UploadedFile() image: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateSliderDto: UpdateSliderDto,
    @Req() req: any,
  ) {
    const clinicId = req['user'].clinic_id;
    let imageUrl = '';
    if (image) {
      imageUrl = `public/uploads/${clinicId}/sliders/${image.filename}`;
    }
    return this.slidersService.update(+id, updateSliderDto, imageUrl);
  }
}
