import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { DatabaseService } from '../shared/database/database.service';
import { InjectRepository } from '@nestjs/typeorm';
import { FrontPatientTestimonial } from '../entites/front-patient-testimonial.entity';
import { Repository } from 'typeorm';
import { FileService } from '../shared/file/file.service';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectRepository(FrontPatientTestimonial)
    private readonly testimonialRepo: Repository<FrontPatientTestimonial>,
    private readonly cls: ClsService,
    private database: DatabaseService,
    private fileService: FileService,
  ) {}

  async create(createTestimonialDto: CreateTestimonialDto, imageUrl: string) {
    const testimonial = this.testimonialRepo.create(createTestimonialDto);
    if (imageUrl) {
      testimonial.image_url = imageUrl;
    }
    if (!testimonial.clinic_id) {
      const user = this.cls.get('user');
      testimonial.clinic_id = user.clinic_id;
    }
    return await this.testimonialRepo.save(testimonial);
  }

  async findAll(query) {
    return await this.database.paginateAndSearch<FrontPatientTestimonial>({
      repository: this.testimonialRepo,
      alias: 'testimonial',
      query: {
        ...query,
      },
      searchFields: ['name', 'short_description'],
      filterFields: ['clinic_id'],
      allowedOrderFields: ['name', 'short_description'],
      defaultOrderField: 'created_at',
      defaultOrderDirection: 'DESC',
      selectFields: [],
      relations: [],
    });
  }

  async findOne(id: number) {
    return {
      data: await this.testimonialRepo.findOneBy({ id }),
    };
  }

  async update(
    id: number,
    updateTestimonialDto: UpdateTestimonialDto,
    imageUrl: string,
  ) {
    const testimonial = await this.testimonialRepo.findOneBy({ id });
    if (!testimonial) throw new NotFoundException('Testimonial not found');

    testimonial.name = updateTestimonialDto.name ?? '';
    testimonial.short_description =
      updateTestimonialDto.short_description ?? '';
    testimonial.designation = updateTestimonialDto.designation ?? '';
    testimonial.clinic_id = updateTestimonialDto.clinic_id ?? 1;

    if (imageUrl) {
      // Delete old file in system
      this.fileService.deleteFile(testimonial.image_url);
      testimonial.image_url = imageUrl;
    }
    return await this.testimonialRepo.save(testimonial);
  }

  async remove(id: number) {
    const testimonial = await this.testimonialRepo.findOneBy({ id });
    if (!testimonial) throw new NotFoundException('Testimonial not found');

    this.fileService.deleteFile(testimonial.image_url);
    await this.testimonialRepo.remove(testimonial);
  }
}
