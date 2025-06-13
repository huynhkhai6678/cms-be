import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { User } from '../entites/user.entity';
import { DatabaseService } from '../shared/database/database.service';
import { ClinicChain } from '../entites/clinic-chain.entity';
import * as moment from 'moment';
import { hashPassword } from 'src/utils/hash.util';
import { Clinic } from '../entites/clinic.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Clinic) private clinicRepo: Repository<Clinic>,
    @InjectRepository(ClinicChain)
    private clinicChainRepo: Repository<ClinicChain>,
    private database: DatabaseService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const count = await this.userRepository.countBy({
      email: createUserDto.email,
    });
    if (count > 0) {
      throw new BadRequestException('Duplicate email');
    }

    const hashed = await hashPassword(createUserDto.password);
    const userDto = this.userRepository.create({
      first_name: createUserDto.first_name,
      last_name: createUserDto.last_name,
      contact: createUserDto.phone.e164Number.split(
        createUserDto.phone.dialCode,
      )[1],
      region_code: createUserDto.phone.dialCode.substring(1),
      email: createUserDto.email,
      password: hashed,
      clinic_chain_id: createUserDto.clinic_chain_id,
      clinic_id: createUserDto.clinic_ids[0],
      type: 1,
      email_verified_at: moment().format('YYYY-MM-DD HH:mm:ss'),
    });

    const clinics = await this.clinicRepo.findBy({
      id: In(createUserDto.clinic_ids),
    });
    userDto.clinics = clinics;
    return this.userRepository.save(userDto);
  }

  async findAll(query) {
    return await this.database.paginateAndSearch<User>({
      repository: this.userRepository,
      alias: 'user',
      query: {
        type: 1,
        clinic_id: { not: 1 },
        ...query,
      },
      searchFields: ['first_name', 'last_name', 'email', 'contact'],
      filterFields: ['type', 'clinic_id'],
      allowedOrderFields: ['first_name', 'last_name', 'email', 'contact'],
      defaultOrderField: 'id',
      defaultOrderDirection: 'DESC',
      selectFields: [
        'id',
        'first_name',
        'last_name',
        'email',
        'contact',
        [
          `(SELECT COUNT(*) FROM user_clinics c WHERE c.user_id = user.id)`,
          'total_clinic',
        ],
      ],
      relations: ['clinic_chain', 'clinics'],
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        clinic_chain: true,
        clinics: true,
      },
    });

    const clinics = await this.clinicRepo.find();

    const clinicChains = await this.clinicChainRepo.find({
      relations: {
        clinics: true,
      },
    });

    return {
      data: {
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        contact: user?.contact || '',
        region_code: user?.region_code || '',
        email: user?.email || '',
        clinic_chain_id: user?.clinic_chain_id || '',
        clinic_ids:
          user?.clinics.map((clinic) => {
            return clinic.id;
          }) || '',
      },
      clinics,
      clinic_chains: clinicChains,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const count = await this.userRepository.count({
      where: {
        id: Not(id),
        email: updateUserDto.email,
      },
    });
    if (count > 0) {
      throw new BadRequestException('Duplicate email');
    }

    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.first_name = updateUserDto.first_name;
    user.last_name = updateUserDto.last_name;
    user.contact = updateUserDto.phone.e164Number.split(
      updateUserDto.phone.dialCode,
    )[1];
    user.region_code = updateUserDto.phone.dialCode.substring(1);
    user.email = updateUserDto.email;
    user.clinic_chain_id = updateUserDto.clinic_chain_id;
    user.clinic_id = updateUserDto.clinic_ids[0];

    const clinics = await this.clinicRepo.findBy({
      id: In(updateUserDto.clinic_ids),
    });
    user.clinics = clinics;

    return this.userRepository.save(user);
  }

  async verify(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException('User link to this doctor not found');
    }

    user.email_verified_at = moment().toDate();
    await this.userRepository.save(user);
    return true;
  }

  async updateStatus(id: number, value: boolean) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException('User link to this doctor not found');
    }

    user.status = value ? 1 : 0;
    await this.userRepository.save(user);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
