import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { Label } from '../entites/label.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseService } from '../shared/database/database.service';
import { Repository } from 'typeorm';

@Injectable()
export class LabelsService {
  constructor(
    @InjectRepository(Label)
    private readonly labelRepo: Repository<Label>,
    private database: DatabaseService,
  ) {}

  async create(createLabelDto: CreateLabelDto) {
    const label = this.labelRepo.create(createLabelDto);
    return await this.labelRepo.save(label);
  }

  async findAll(query) {
    return await this.database.paginateAndSearch<Label>({
      repository: this.labelRepo,
      alias: 'label',
      query: {
        ...query,
      },
      searchFields: ['name', 'type'],
      filterFields: ['clinic_id'],
      allowedOrderFields: ['name', 'type'],
      defaultOrderField: 'created_at',
      defaultOrderDirection: 'DESC',
      selectFields: [],
      relations: [],
    });
  }

  async findOne(id: number) {
    return {
      data: await this.labelRepo.findOneBy({ id }),
    };
  }

  async update(id: number, updateLabelDto: UpdateLabelDto) {
    const label = await this.labelRepo.findOneBy({ id });
    if (!label) throw new NotFoundException('Service not found');

    Object.assign(label, updateLabelDto);
    return await this.labelRepo.save(label);
  }

  async remove(id: number) {
    const label = await this.labelRepo.findOneBy({ id });
    if (!label) throw new NotFoundException('Service not found');
    return await this.labelRepo.remove(label);
  }
}
