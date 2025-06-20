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

  async create(createClinicServiceDto: CreateClinicServiceDto) {
    const subscriber = this.clinicServiceRepo.create(createClinicServiceDto);
    return await this.clinicServiceRepo.save(subscriber);
  }

  async findAll(query) {
    return await this.dataTable.paginateAndSearch<ClinicService>({
      repository: this.clinicServiceRepo,
      alias: 'clinic_service',
      query: {
        ...query,
      },
      searchFields: ['name', 'description', 'price', 'cost'],
      filterFields: ['clinic_id', 'active'],
      allowedOrderFields: ['name', 'description', 'price', 'cost'],
      defaultOrderField: 'created_at',
      defaultOrderDirection: 'DESC',
      selectFields: [],
      relations: [],
    });
  }

  async findOne(id: number) {
    return {
      data: await this.clinicServiceRepo.findOneBy({ id }),
    };
  }

  async update(id: number, updateClinicServiceDto: UpdateClinicServiceDto) {
    const subscriber = await this.clinicServiceRepo.findOneBy({ id });
    if (!subscriber) {
      throw new NotFoundException('Clinic service not found');
    }

    return await this.clinicServiceRepo.update({ id }, updateClinicServiceDto);
  }

  async remove(id: number) {
    const clinicService = await this.clinicServiceRepo.findOneBy({ id });
    if (!clinicService) {
      throw new NotFoundException('Enquiry not found');
    }

    return await this.clinicServiceRepo.remove(clinicService);
  }

  async updateActive(id: number, active: boolean) {
    const clinicService = await this.clinicServiceRepo.findOneBy({ id });
    if (!clinicService) {
      throw new NotFoundException('Enquiry not found');
    }

    clinicService.active = active ? 1 : 0;
    return await this.clinicServiceRepo.save(clinicService);
  }
}
