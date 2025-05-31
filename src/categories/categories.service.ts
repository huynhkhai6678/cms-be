import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseService } from '../shared/database/database.service';
import { Brand } from '../entites/brand.entity';
import { Category } from 'src/entites/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    private database: DatabaseService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const label = this.categoryRepo.create(createCategoryDto);
    return await this.categoryRepo.save(label);
  }

  async findAll(query) {
    return await this.database.paginateAndSearch<Category>({
      repository: this.categoryRepo,
      alias: 'brand',
      query: {
        ...query,
      },
      searchFields: ['name', 'email', 'phone'],
      filterFields: ['clinic_id', 'is_active'],
      allowedOrderFields: ['name', 'email', 'phone'],
      defaultOrderField: 'created_at',
      defaultOrderDirection: 'DESC',
      selectFields: [],
      relations: [],
    });
  }

  async findOne(id: number) {
    return {
      data: await this.categoryRepo.findOneBy({ id }),
    };
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const brand = await this.categoryRepo.findOneBy({ id });
    if (!brand) throw new NotFoundException('Category not found');

    Object.assign(brand, updateCategoryDto);
    return await this.categoryRepo.save(brand);
  }

  async remove(id: number) {
    const brand = await this.categoryRepo.findOneBy({ id });
    if (!brand) throw new NotFoundException('Category not found');
    return await this.categoryRepo.remove(brand);
  }

  async updateStatus(id: number, active : boolean) {
    const category = await this.categoryRepo.findOneBy({ id });
    if (!category) throw new NotFoundException('Category not found');

    category.is_active = active;
    return await this.categoryRepo.save(category);
  }
}
