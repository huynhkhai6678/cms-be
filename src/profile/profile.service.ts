import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entites/user.entity';
import { Repository } from 'typeorm';
import { Address } from '../entites/address.entity';
import { Country } from '../entites/country.entity';
import { City } from '../entites/city.entity';
import { State } from '../entites/state.entity';
import { hashPassword } from 'src/utils/hash.util';

@Injectable()
export class ProfileService {

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>,
    @InjectRepository(State)
    private readonly stateRepo: Repository<State>,
    @InjectRepository(City)
    private readonly cityRepo: Repository<City>,
  ) {}

  async getProfile(userId : number) {
    const qb = this.userRepo.createQueryBuilder('user');
    qb.leftJoinAndMapOne(
      'user.address',
      Address,
      'address',
      'address.owner_id = user.id AND address.owner_type = :ownerType',
      { ownerType: 'App\\Models\\User' },
    );

    qb.where('user.id = :id', { id : userId });
    const user = await qb.getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const countries = await this.countryRepo
      .createQueryBuilder('country')
      .select([
        'country.id AS value',
        'country.name AS label'
      ])
      .getRawMany();

    let states : State[] = [];
    if (user.address?.country_id) {
      states = await this.stateRepo
      .createQueryBuilder('state')
      .select([
        'state.id AS value',
        'state.name AS label'
      ])
      .where('state.country_id = :id', { id : user.address.country_id })
      .getRawMany();
    }

    let cities : City[] = [];
    if (user.address?.state_id) {
      cities = await this.cityRepo
      .createQueryBuilder('city')
      .select([
        'city.id AS value',
        'city.name AS label'
      ])
      .where('city.state_id = :id', { id : user.address.state_id })
      .getRawMany();
    }

    return {
      data : {
        contact: `${user.contact}`,
        region_code: `${user.region_code}`,
        dob: user.dob,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        gender: user.gender,
        blood_group: user.blood_group,
        time_zone: user.time_zone,
        address1: user.address?.address1,
        address2: user.address?.address2,
        country_id: user.address?.country_id,
        state_id: user.address?.state_id,
        city_id: user.address?.city_id,
        postal_code: user.address?.postal_code,
      },
      countries,
      states,
      cities
    }
  }

  updateProfile(id : number, updateProfileDto: UpdateProfileDto) {
    return `This action returns all profile`;
  }

  async changePassword(id : number, changePasswordDto: ChangePasswordDto) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashed = await hashPassword(changePasswordDto.new_password);
    user.password = hashed;
    return this.userRepo.save(user);
  }

  async updateLanguage(id : number, language: string) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.language = language;
    return this.userRepo.save(user);
  }

  async updateTheme(id : number, isDark: boolean) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.dark_mode = isDark;
    return this.userRepo.save(user);
  }
}
