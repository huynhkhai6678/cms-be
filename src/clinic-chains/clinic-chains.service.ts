import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClinicChainDto } from './dto/create-clinic-chain.dto';
import { UpdateClinicChainDto } from './dto/update-clinic-chain.dto';
import { ClinicChain } from '../entites/clinic-chain.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseService } from '../shared/database/database.service';
import { Clinic } from '../entites/clinic.entity';

@Injectable()
export class ClinicChainsService {
  constructor(
    @InjectRepository(ClinicChain)
    private readonly clinicChainRepo: Repository<ClinicChain>,
    @InjectRepository(Clinic)
    private readonly clinicRepo: Repository<Clinic>,
    private database: DatabaseService,
  ) {}

  async create(createClinicChainDto: CreateClinicChainDto) {
    let roleDto = new ClinicChain();
    roleDto.name = createClinicChainDto.name;

    const clinics = await this.clinicRepo.findBy({
      id: In(createClinicChainDto.clinic_ids),
    });
    roleDto.clinics = clinics;
    return await this.clinicChainRepo.save(roleDto);
  }

  async findAll(query) {
    return await this.database.paginateAndSearch<ClinicChain>({
      repository: this.clinicChainRepo,
      alias: 'role',
      query: query,
      searchFields: ['name'],
      filterFields: [],
      allowedOrderFields: ['name'],
      defaultOrderField: 'created_at',
      defaultOrderDirection: 'DESC',
      selectFields : [],
      relations: ['clinics'],
    });
  }

  async findOne(id: number) {
    const clinicChain = await this.clinicChainRepo.findOne({
      where: {
        id,
      },
      relations: {
        clinics: true,
      },
    });
    const clinics = await this.clinicRepo.find();

    return {
      data: {
        name: clinicChain?.name || '',
        clinic_ids:
          clinicChain?.clinics.map((clinic) => {
            return clinic.id;
          }) || [],
      },
      clinics,
    };
  }

  async update(id: number, updateClinicChainDto: UpdateClinicChainDto) {
    const role = await this.clinicChainRepo.findOne({
      where: { id },
      relations: ['clinics'],
    });

    if (!role) throw new NotFoundException('Role not found');

    const newClinics = await this.clinicRepo.findBy({
      id: In(updateClinicChainDto.clinic_ids ?? []),
    });

    role.clinics = newClinics;
    return this.clinicChainRepo.save(role);
  }

  async remove(id: number) {
    const role = await this.clinicChainRepo.findOne({
      where: { id },
      relations: ['clinics'], // load related permissions
    });

    if (!role) {
      throw new NotFoundException('Clinic chain not found');
    }

    await this.clinicChainRepo.remove(role);
  }
}
