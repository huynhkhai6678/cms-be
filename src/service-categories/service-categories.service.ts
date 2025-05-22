import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';
import { ServiceCategory } from '../entites/service-category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseService } from '../shared/database/database.service';

@Injectable()
export class ServiceCategoriesService {
  constructor(
    @InjectRepository(ServiceCategory)
    private readonly serviceCateRepo: Repository<ServiceCategory>,
    private database: DatabaseService,
  ) {}

  async create(createServiceCategoryDto: CreateServiceCategoryDto) {
    const category = this.serviceCateRepo.create(createServiceCategoryDto);
    return await this.serviceCateRepo.save(category);
  }

  async findAll(query) {
    return await this.database.paginateAndSearch<ServiceCategory>({
      repository: this.serviceCateRepo,
      alias: 'service_category',
      query: {
        ...query,
      },
      searchFields: ['name'],
      filterFields: ['clinic_id'],
      allowedOrderFields: ['name'],
      defaultOrderField: 'created_at',
      defaultOrderDirection: 'DESC',
      selectFields: [],
      relations: ['services'],
    });
  }

  async findOne(id: number) {
    return {
      data: await this.serviceCateRepo.findOneBy({ id }),
    };
  }

  async update(id: number, updateServiceCategoryDto: UpdateServiceCategoryDto) {
    const category = await this.serviceCateRepo.findOneBy({ id });
    if (!category) throw new NotFoundException('Service not found');

    category.name = updateServiceCategoryDto.name ?? '';
    category.clinic_id = updateServiceCategoryDto.clinic_id ?? 0;
    return await this.serviceCateRepo.save(category);
  }

  async remove(id: number) {
    const category = await this.serviceCateRepo.findOneBy({ id });
    if (!category) throw new NotFoundException('Service not found');

    await this.serviceCateRepo.remove(category);
  }
}
