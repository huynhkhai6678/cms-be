import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../entites/city.entity';
import { State } from '../entites/state.entity';
import { Clinic } from '../entites/clinic.entity';
import { Country } from '../entites/country.entity';
import { Address } from '../entites/address.entity';

@Injectable()
export class ClinicsService {
  constructor(
    @InjectRepository(Clinic)
    private readonly clinicRepository: Repository<Clinic>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async create(createClinicDto: CreateClinicDto) {
    const clinicDto = this.clinicRepository.create({
      name: createClinicDto.name,
      landing_name: createClinicDto.landing_name,
      type: createClinicDto.type,
      email: createClinicDto.email,
      phone: createClinicDto.phone.e164Number.split(
        createClinicDto.phone.dialCode,
      )[1],
      region_code: createClinicDto.phone.dialCode.substring(1),
      social_link: createClinicDto.social_link,
      country_id: createClinicDto.country_id,
    });

    const clinic = await this.clinicRepository.save(clinicDto);

    const addressDto = this.addressRepository.create({
      address1: createClinicDto.address1,
      country_id: createClinicDto.country_id ?? null,
      address2: createClinicDto.address2,
      state_id: createClinicDto.state_id ?? null,
      city_id: createClinicDto.city_id ?? null,
      postal_code: createClinicDto.postal_code,
      owner_type: 'App\\Models\\Clinic',
      owner_id: clinic.id,
    });

    this.addressRepository.save(addressDto);

    return true;
  }

  async findAll(query) {
    return await this.getPaginatedClinics(query);
  }

  async findOne(id: number) {
    const qb = this.clinicRepository.createQueryBuilder('clinic');

    qb.leftJoinAndMapOne(
      'clinic.address',
      Address,
      'address',
      'address.owner_id = clinic.id AND address.owner_type = :ownerType',
      { ownerType: 'App\\Models\\Clinic' },
    );

    qb.where('clinic.id = :id', { id });
    const clinic = await qb.getOne();

    const countries = await this.countryRepository.find();

    let states: State[] = [];
    let cities: City[] = [];
    if (clinic) {
      if (clinic.address.country_id) {
        states = await this.stateRepository.find({
          where: {
            country_id: clinic.address.country_id,
          },
        });
      }

      if (clinic.address.state_id) {
        cities = await this.cityRepository.find({
          where: {
            state_id: clinic.address.state_id,
          },
        });
      }
    }

    let clinicResult: any = null;
    if (clinic) {
      clinicResult = {
        address1: clinic.address.address1,
        address2: clinic.address.address2,
        city_id: clinic.address.city_id,
        country_id: clinic.address.country_id,
        state_id: clinic.address.state_id,
        postal_code: clinic.address.postal_code,
        email: clinic.email,
        landing_name: clinic.landing_name,
        type: clinic.type,
        name: clinic.name,
        phone: clinic.phone,
        region_code: clinic.region_code,
      };
    }

    return {
      clinic: clinicResult,
      countries,
      states,
      cities,
    };
  }

  async update(id: number, updateClinicDto: UpdateClinicDto) {
    const clinic = await this.clinicRepository.findOne({
      where: { id },
    });

    if (!clinic) {
      throw new NotFoundException('Clinic not found');
    }

    this.clinicRepository.update(
      { id },
      {
        name: updateClinicDto.name,
        landing_name: updateClinicDto.landing_name,
        type: updateClinicDto.type,
        email: updateClinicDto.email,
        phone: updateClinicDto.phone?.e164Number.split(
          updateClinicDto.phone?.dialCode,
        )[1],
        region_code: updateClinicDto.phone?.dialCode.substring(1),
        social_link: updateClinicDto.social_link,
        country_id: updateClinicDto.country_id,
      },
    );

    const addrress = await this.addressRepository.findOne({
      where: {
        owner_id: clinic.id,
        owner_type: 'App\\Models\\Clinic',
      },
    });

    if (addrress) {
      this.addressRepository.update(
        { id: addrress.id },
        {
          address1: updateClinicDto.address1,
          country_id: updateClinicDto.country_id ?? null,
          address2: updateClinicDto.address2,
          state_id: updateClinicDto.state_id ?? null,
          city_id: updateClinicDto.city_id ?? null,
          postal_code: updateClinicDto.postal_code,
          owner_type: 'App\\Models\\Clinic',
          owner_id: clinic.id,
        },
      );
    }
  }

  async remove(id: number) {
    const clinic = await this.clinicRepository.findOne({
      where: { id },
    });

    if (!clinic) {
      throw new NotFoundException('Clinic not found');
    }

    const addrress = await this.addressRepository.findOne({
      where: {
        owner_id: clinic.id,
        owner_type: 'App\\Models\\Clinic',
      },
    });

    if (addrress) {
      await this.addressRepository.remove(addrress);
    }

    await this.clinicRepository.remove(clinic);
  }

  async getPaginatedClinics(query: any) {
    const take = Number(query.limit) || 10;
    const page = Number(query.page) || 1;
    const skip = (page - 1) * take;

    const qb = this.clinicRepository.createQueryBuilder('clinic');

    qb.leftJoinAndMapOne(
      'clinic.address',
      Address,
      'address',
      'address.owner_id = clinic.id AND address.owner_type = :ownerType',
      { ownerType: 'App\\Models\\Clinic' },
    );

    qb.leftJoinAndMapOne(
      'address.state',
      State,
      'state',
      'state.id = address.state_id',
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

    const orderByField =
      query.orderBy && orderableFieldsMap[query.orderBy]
        ? orderableFieldsMap[query.orderBy]
        : 'clinic.id';

    const orderDirection =
      query.order && ['ASC', 'DESC'].includes(query.order.toUpperCase())
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
