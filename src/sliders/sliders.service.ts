import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slider } from 'src/entites/slider.entity';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class SlidersService {
  constructor(
    @InjectRepository(Slider)
    private readonly sliderRepo: Repository<Slider>,
    private database: DatabaseService,
  ) {}

  async findAll(query) {
    return await this.database.paginateAndSearch<Slider>({
      repository: this.sliderRepo,
      alias: 'slider',
      query: {
        ...query,
      },
      searchFields: ['title', 'short_description'],
      filterFields: ['clinic_id'],
      allowedOrderFields: ['title', 'short_description'],
      defaultOrderField: 'created_at',
      defaultOrderDirection: 'DESC',
      selectFields: [],
      relations: [],
    });
  }

  async findOne(id: number) {
    return {
      data: await this.sliderRepo.findOneBy({ id }),
    };
  }

  async update(id: number, updateSliderDto: UpdateSliderDto, imageUrl) {
    const slider = await this.sliderRepo.findOneBy({ id });
    if (!slider) throw new NotFoundException('Faq not found');

    slider.title = updateSliderDto.title ?? '';
    slider.short_description = updateSliderDto.short_description ?? '';
    slider.clinic_id = updateSliderDto.clinic_id ?? 1;

    if (imageUrl) {
      slider.image_url = imageUrl;
    }
    return await this.sliderRepo.save(slider);
  }
}
