import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuardFactory } from '../guards/role.guard.factory';
import { FileInterceptor } from '@nestjs/platform-express';
import { createFileUploadStorage } from '../utils/upload-file.util';
import { fileFilter } from '../utils/file-util';
import { QueryParamsDto } from '../shared/dto/query-params.dto';

@UseGuards(AuthGuard, RoleGuardFactory('manage_staff'))
@Controller('staffs')
export class StaffsController {
  constructor(private readonly staffsService: StaffsService) {}

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
    @Body(new ValidationPipe()) createStaffDto: CreateStaffDto,
  ) {
    const clinicIds = createStaffDto.clinic_ids.split(',') || [];
    const clinicId = clinicIds[0] || req['user'].clinic_id;
    let imageUrl = '';
    if (avatar) {
      imageUrl = `public/uploads/${clinicId}/users/${avatar.filename}`;
    }
    return this.staffsService.create(createStaffDto, imageUrl);
  }

  @Get()
  findAll(@Query() query: QueryParamsDto) {
    return this.staffsService.findAll(query);
  }

  @Get('detail/:id')
  findDetail(@Param('id') id: number) {
    return this.staffsService.findDetail(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffsService.findOne(+id);
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
    @Body(new ValidationPipe()) updateStaffDto: UpdateStaffDto,
  ) {
    const clinicIds = updateStaffDto.clinic_ids?.split(',') || [];
    const clinicId = clinicIds[0] || req['user'].clinic_id;
    let imageUrl = '';
    if (avatar) {
      imageUrl = `public/uploads/${clinicId}/users/${avatar.filename}`;
    }
    return this.staffsService.update(+id, updateStaffDto, imageUrl);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffsService.remove(+id);
  }
}
