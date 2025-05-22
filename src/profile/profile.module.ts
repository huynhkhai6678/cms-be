import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entites/user.entity';
import { Address } from '../entites/address.entity';
import { City } from '../entites/city.entity';
import { State } from '../entites/state.entity';
import { Country } from '../entites/country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address, City, State, Country])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
