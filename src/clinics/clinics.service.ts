import { Injectable } from '@nestjs/common';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clinic } from './entities/clinic.entity';
import { DatabaseService } from 'src/shared/database/database.service';
import { Address } from './entities/address.entity';
import { State } from './entities/state.entity';

@Injectable()
export class ClinicsService {

  constructor( 
    @InjectRepository(Clinic)
    private readonly clinicRepository: Repository<Clinic>,
  ) {}
  
  create(createClinicDto: CreateClinicDto) {
    return 'This action adds a new clinic';
  }

  async findAll(query) {
    return await this.getPaginatedClinics(query);
  }

  findOne(id: number) {
    return 'This action adds a new clinic';
  }

  update(id: number, updateClinicDto: UpdateClinicDto) {
    return `This action updates a #${id} clinic`;
  }

  remove(id: number) {
    return `This action removes a #${id} clinic`;
  }

  async  getPaginatedClinics(query: any) {
    const take = Number(query.limit) || 10;
    const page = Number(query.page) || 1;
    const skip = (page - 1) * take;

    const qb = this.clinicRepository.createQueryBuilder('clinic');
    
    qb.leftJoinAndMapOne(
      'clinic.address',
      Address,
      'address',
      'address.owner_id = clinic.id AND address.owner_type = :ownerType',
      { ownerType: 'App\\Models\\Clinic' }
    );

    qb.leftJoinAndMapOne(
      'address.state',
      State,
      'state',
      'state.id = address.state_id'
    );

    qb.select([
      `clinic.id`,
      `clinic.name`,
      `clinic.phone`,
      `clinic.region_code`,
      `address.address1`,
      `address.postal_code`,
      `state.name`,
    ]);

    // Search
    if (query.search) {
      qb.andWhere(
         `(clinic.name LIKE :search 
        OR clinic.phone LIKE :search 
        OR address.address1 LIKE :search 
        OR state.name LIKE :search)`,
        { search: `%${query.search}%` },
      );
    }

    // ORDER BY logic
    const orderableFieldsMap = {
      name: 'clinic.name',
      phone: 'clinic.phone',
      'address.address1': 'address.address1',
      'address.state.name': 'state.name',
    };

    const orderByField = query.orderBy && orderableFieldsMap[query.orderBy]
      ? orderableFieldsMap[query.orderBy]
      : 'clinic.id';

    const orderDirection =
      (query.order && ['ASC', 'DESC'].includes(query.order.toUpperCase()))
        ? query.order.toUpperCase()
        : 'DESC';

    qb.orderBy(orderByField, orderDirection as 'ASC' | 'DESC');
    // Pagination
    qb.skip(skip).take(take);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      pagination: {
        page,
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    };
  }
}
