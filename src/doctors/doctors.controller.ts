import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards, ValidationPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuardFactory } from '../guards/role.guard.factory';
import { FileInterceptor } from '@nestjs/platform-express';
import { createFileUploadStorage } from 'src/utils/upload-file.util';
import { fileFilter } from '../utils/file-util';

@UseGuards(AuthGuard, RoleGuardFactory('manage_doctors'))
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: createFileUploadStorage('users'),
      fileFilter,
    }),
  )
  create(
    @UploadedFile() avatar: Express.Multer.File,
    @Req() req: any,
    @Body(new ValidationPipe()) createDoctorDto: CreateDoctorDto
  ) {
    const clinicIds = createDoctorDto.clinic_ids.split(',') || [];
    const clinicId = clinicIds[0] || req['user'].clinic_id;
    let imageUrl = '';
    if (avatar) {
      imageUrl = `public/uploads/${clinicId}/users/${avatar.filename}`;
    }
    return this.doctorsService.create(createDoctorDto, imageUrl);
  }

  @Get()
  findAll(@Query() query) {
    return this.doctorsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const user = req['user'];
    return this.doctorsService.findOne(+id, user.clinic_id);
  }

  @Post(':id')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: createFileUploadStorage('users'),
      fileFilter,
    }),
  )
  update(
    @UploadedFile() avatar: Express.Multer.File,
    @Req() req: any,
    @Param('id') id: string, 
    @Body(new ValidationPipe()) updateDoctorDto: UpdateDoctorDto) {

    const clinicIds = updateDoctorDto.clinic_ids?.split(',') || [];
    const clinicId = clinicIds[0] || req['user'].clinic_id;
    let imageUrl = '';
    if (avatar) {
      imageUrl = `public/uploads/${clinicId}/users/${avatar.filename}`;
    }
    return this.doctorsService.update(+id, updateDoctorDto, imageUrl);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorsService.remove(+id);
  }
}
