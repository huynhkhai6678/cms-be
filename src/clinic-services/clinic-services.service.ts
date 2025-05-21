import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClinicServiceDto } from './dto/create-clinic-service.dto';
import { UpdateClinicServiceDto } from './dto/update-clinic-service.dto';
import { ClinicService } from '../entites/clinic-service.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseService } from '../shared/database/database.service';

@Injectable()
export class ClinicServicesService {

  constructor(
    @InjectRepository(ClinicService)
    private readonly clinicServiceRepo: Repository<ClinicService>,
    private dataTable: DatabaseService,
  ) {}

  create(createClinicServiceDto: CreateClinicServiceDto) {
    const subscriber = this.clinicServiceRepo.create(createClinicServiceDto)
    return this.clinicServiceRepo.save(subscriber);
  }

  async findAll(query) {
    return await this.dataTable.paginateAndSearch<ClinicService>({
      repository: this.clinicServiceRepo,
      alias: 'clinic_service',
      query: {
        ...query
      },
      searchFields: ['name', 'description', 'price', 'cost'],
      filterFields: ['clinic_id', 'active'],
      allowedOrderFields: ['name', 'description', 'price', 'cost'],
      defaultOrderField: 'created_at',
      defaultOrderDirection: 'DESC',
      selectFields : [],
      relations: [],
    });
  }

  async findOne(id: number) {
    return {
      data: await this.clinicServiceRepo.findOneBy({ id })
    }
  }

  async update(id: number, updateClinicServiceDto: UpdateClinicServiceDto) {
    const subscriber = await this.clinicServiceRepo.findOneBy({ id });
    if (!subscriber) {
      throw new NotFoundException('Clinic service not found');
    }
    
    return this.clinicServiceRepo.update(
      { id },
      updateClinicServiceDto
    );
  }

  async remove(id: number) {
    const enquiry = await this.clinicServiceRepo.findOneBy({ id });
    if (!enquiry) {
      throw new NotFoundException('Enquiry not found');
    }

    this.clinicServiceRepo.remove(enquiry);
  }

  async updateActive(id: number, active: boolean) {
    const enquiry = await this.clinicServiceRepo.findOneBy({ id });
    if (!enquiry) {
      throw new NotFoundException('Enquiry not found');
    }

    enquiry.active = active ? 1 : 0;
    this.clinicServiceRepo.save(enquiry);
  }
}
