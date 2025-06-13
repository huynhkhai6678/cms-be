import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ValidationPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuardFactory } from '../guards/role.guard.factory';
import { FileInterceptor } from '@nestjs/platform-express';
import { createFileUploadStorage } from '../utils/upload-file.util';
import { fileFilter } from '../utils/file-util';

@UseGuards(AuthGuard, RoleGuardFactory('manage_front_cms'))
@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: createFileUploadStorage('testimonials'),
      fileFilter: fileFilter,
    }),
  )
  create(
    @UploadedFile() image: Express.Multer.File,
    @Req() req: any,
    @Body(ValidationPipe) createTestimonialDto: CreateTestimonialDto,
  ) {
    const clinicId = createTestimonialDto.clinic_id || req['user'].clinic_id;
    let imageUrl = '';
    if (image) {
      imageUrl = `public/uploads/${clinicId}/testimonials/${image.filename}`;
    }
    return this.testimonialsService.create(createTestimonialDto, imageUrl);
  }

  @Get()
  findAll(@Query() query) {
    return this.testimonialsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testimonialsService.findOne(+id);
  }

  @Post(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: createFileUploadStorage('testimonials'),
      fileFilter: fileFilter,
    }),
  )
  update(
    @UploadedFile() image: Express.Multer.File,
    @Req() req: any,
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateTestimonialDto: UpdateTestimonialDto,
  ) {
    const clinicId = updateTestimonialDto.clinic_id || req['user'].clinic_id;
    let imageUrl = '';
    if (image) {
      imageUrl = `public/uploads/${clinicId}/testimonials/${image.filename}`;
    }
    return this.testimonialsService.update(+id, updateTestimonialDto, imageUrl);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testimonialsService.remove(+id);
  }
}
