import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from 'src/entites/service.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseService } from 'src/shared/database/database.service';
import { ServiceCategory } from 'src/entites/service-category.entity';
import { Doctor } from 'src/entites/doctor.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
    @InjectRepository(ServiceCategory)
    private readonly serviceCateRepo: Repository<ServiceCategory>,
    @InjectRepository(Doctor)
    private readonly doctorRepo: Repository<Doctor>,
    private database: DatabaseService,
  ) {}

  async create(createServiceDto: CreateServiceDto, imageUrl: string) {
    const serviceDto = new Service();

    const ids = createServiceDto.doctor_ids.split(',');
    serviceDto.name = createServiceDto.name;
    serviceDto.category_id = createServiceDto.category_id;
    serviceDto.status = createServiceDto.status ? 1 : 0;
    serviceDto.short_description = createServiceDto.short_description;
    serviceDto.charges = createServiceDto.charges;
    serviceDto.clinic_id = createServiceDto.clinic_id || 1;
    serviceDto.image_url = imageUrl;

    const doctors = await this.doctorRepo.findBy({
      id: In(ids),
    });

    serviceDto.doctors = doctors;
    return await this.serviceRepo.save(serviceDto);
  }

  async findAll(query) {
    return await this.database.paginateAndSearch<Service>({
      repository: this.serviceRepo,
      alias: 'service',
      query: {
        ...query,
      },
      searchFields: ['name', 'category.name', 'charges'],
      filterFields: ['clinic_id'],
      allowedOrderFields: ['name', 'category.name', 'charges'],
      defaultOrderField: 'created_at',
      defaultOrderDirection: 'DESC',
      selectFields: [],
      relations: ['category'],
    });
  }

  async findOne(id: number, clinic_id) {
    const doctors = await this.doctorRepo
      .createQueryBuilder('doctor')
      .innerJoin('doctor.user', 'user')
      .innerJoin(
        'user.user_clinics',
        'userClinic',
        'userClinic.clinic_id = :clinicId',
        { clinicId: clinic_id },
      )
      .addSelect([
        'doctor.id as value',
        'CONCAT(user.first_name, " ", user.last_name) AS label',
      ])
      .getRawMany();

    const categories = await this.serviceCateRepo.find({
      where: {
        clinic_id,
      },
    });

    const service = await this.serviceRepo.findOne({
      where: {
        id,
      },
      relations: ['doctors'],
    });

    return {
      data: {
        doctor_ids: service?.doctors.map((doctor) => {
          return doctor.id;
        }),
        ...service,
      },
      doctors: doctors.map((doctor) => {
        return { value: doctor.value, label: doctor.label };
      }),
      categories: categories.map((category) => {
        return { value: category.id, label: category.name };
      }),
    };
  }

  async update(
    id: number,
    updateServiceDto: UpdateServiceDto,
    imageUrl: string,
  ) {
    const service = await this.serviceRepo.findOne({
      where: { id },
      relations: ['doctors'],
    });

    if (!service) throw new NotFoundException('Service not found');

    const ids = updateServiceDto.doctor_ids?.split(',') || [];
    const newDoctors = await this.doctorRepo.findBy({
      id: In(ids),
    });

    service.name = updateServiceDto.name ?? '';
    service.category_id = updateServiceDto.category_id ?? 0;
    service.status = updateServiceDto.status ? 1 : 0;
    service.short_description = updateServiceDto.short_description ?? '';
    service.charges = updateServiceDto.charges;
    service.clinic_id = updateServiceDto.clinic_id || 1;
    service.doctors = newDoctors;
    if (imageUrl) {
      service.image_url = imageUrl;
    }

    return this.serviceRepo.save(service);
  }

  async remove(id: number) {
    const service = await this.serviceRepo.findOne({
      where: { id },
      relations: ['doctors'], // load related permissions
    });

    if (!service) throw new NotFoundException('Service not found');
    await this.serviceRepo.remove(service);
  }

  async updateActive(id: number, status: boolean) {
    const service = await this.serviceRepo.findOneBy({ id });
    if (!service) throw new NotFoundException('Service not found');

    service.status = status ? 1 : 0;
    this.serviceRepo.save(service);
  }
}
