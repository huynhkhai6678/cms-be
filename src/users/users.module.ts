import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '../entites/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseServiceModule } from '../shared/database/database.module';
import { Clinic } from '../entites/clinic.entity';
import { ClinicChain } from '../entites/clinic-chain.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Clinic, ClinicChain]), DatabaseServiceModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
