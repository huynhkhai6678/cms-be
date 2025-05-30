import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from '../entites/brand.entity';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
    private database: DatabaseService,
  ) {}

  async create(createBrandDto: CreateBrandDto) {
    if (createBrandDto.contact) {
      createBrandDto.phone = createBrandDto.contact.e164Number.trim();
    }
    const brand = this.brandRepo.create(createBrandDto);
    return await this.brandRepo.save(brand);
  }

  async findAll(query) {
    return await this.database.paginateAndSearch<Brand>({
      repository: this.brandRepo,
      alias: 'brand',
      query: {
        ...query,
      },
      searchFields: ['name', 'email', 'phone'],
      filterFields: ['clinic_id'],
      allowedOrderFields: ['name', 'email', 'phone'],
      defaultOrderField: 'created_at',
      defaultOrderDirection: 'DESC',
      selectFields: [],
      relations: [],
    });
  }

  async findOne(id: number) {
    return {
      data: await this.brandRepo.findOneBy({ id }),
    };
  }

  async update(id: number, updateBrandDto: UpdateBrandDto) {
    const brand = await this.brandRepo.findOneBy({ id });
    if (!brand) throw new NotFoundException('Supplier not found');

    if (updateBrandDto.contact) {
      updateBrandDto.phone = updateBrandDto.contact?.e164Number.trim();
    }
    Object.assign(brand, updateBrandDto);
    return await this.brandRepo.save(brand);
  }

  async remove(id: number) {
    const brand = await this.brandRepo.findOneBy({ id });
    if (!brand) throw new NotFoundException('Supplier not found');
    return await this.brandRepo.remove(brand);
  }
}
