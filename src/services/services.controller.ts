import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuardFactory } from '../guards/role.guard.factory';
import { FileInterceptor } from '@nestjs/platform-express';
import { createFileUploadStorage } from '../utils/upload-file.util';
import { fileFilter } from '../utils/file-util';

@UseGuards(AuthGuard, RoleGuardFactory('manage_front_cms'))
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: createFileUploadStorage('services'),
      fileFilter: fileFilter,
    }),
  )
  create(
    @UploadedFile() logo: Express.Multer.File,
    @Req() req: any,
    @Body(new ValidationPipe()) createServiceDto: CreateServiceDto,
  ) {
    const clinicId = createServiceDto.clinic_id || req['user'].clinic_id;
    let imageUrl = '';
    if (logo) {
      imageUrl = `public/uploads/${clinicId}/services/${logo.filename}`;
    }
    return this.servicesService.create(createServiceDto, imageUrl);
  }

  @Get()
  async findAll(@Query() query) {
    return this.servicesService.findAll(query);
  }

  @Get(':id')
  findOne(@Req() request, @Param('id') id: string) {
    const user = request.user;
    return this.servicesService.findOne(+id, user.clinic_id);
  }

  @Post(':id')
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: createFileUploadStorage('services'),
      fileFilter: fileFilter,
    }),
  )
  update(
    @UploadedFile() logo: Express.Multer.File,
    @Req() req: any,
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateServiceDto: UpdateServiceDto,
  ) {
    const clinicId = updateServiceDto.clinic_id || req['user'].clinic_id;
    let imageUrl = '';
    if (logo) {
      imageUrl = `public/uploads/${clinicId}/services/${logo.filename}`;
    }
    return this.servicesService.update(+id, updateServiceDto, imageUrl);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(+id);
  }

  @Post('/update-status/:id')
  async updateActive(@Param('id') id: number, @Body('status') active: boolean) {
    return this.servicesService.updateActive(+id, active);
  }
}
