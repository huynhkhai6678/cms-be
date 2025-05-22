import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSpecilizationDto } from './dto/create-specilization.dto';
import { UpdateSpecilizationDto } from './dto/update-specilization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialization } from '../entites/specilization.entity';
import { DatabaseService } from '../shared/database/database.service';

@Injectable()
export class SpecilizationsService {
  constructor(
    @InjectRepository(Specialization)
    private readonly spicializationRepo: Repository<Specialization>,
    private database: DatabaseService,
  ) {}

  create(createSpecilizationDto: CreateSpecilizationDto) {
    const spicialization = this.spicializationRepo.create(
      createSpecilizationDto,
    );
    return this.spicializationRepo.save(spicialization);
  }

  async findAll(query) {
    return await this.database.paginateAndSearch<Specialization>({
      repository: this.spicializationRepo,
      alias: 'specialization',
      query: {
        ...query,
      },
      searchFields: ['name'],
      filterFields: ['clinic_id'],
      allowedOrderFields: ['name'],
      defaultOrderField: 'created_at',
      defaultOrderDirection: 'DESC',
      selectFields: [],
      relations: [],
    });
  }

  async findOne(id: number) {
    return {
      data: await this.spicializationRepo.findOneBy({ id }),
    };
  }

  async update(id: number, updateSpecilizationDto: UpdateSpecilizationDto) {
    const specialization = await this.spicializationRepo.findOneBy({ id });
    if (!specialization) {
      throw new NotFoundException('Specilization not found');
    }

    specialization.name = updateSpecilizationDto.name || '';
    return this.spicializationRepo.save(specialization);
  }

  async remove(id: number) {
    const specialization = await this.spicializationRepo.findOneBy({ id });
    if (!specialization) {
      throw new NotFoundException('specilization not found');
    }
    return this.spicializationRepo.remove(specialization);
  }
}
