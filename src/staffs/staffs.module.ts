import { Module } from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { StaffsController } from './staffs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entites/user.entity';
import { Address } from '../entites/address.entity';
import { Clinic } from '../entites/clinic.entity';
import { AuthModule } from '../auth/auth.module';
import { Role } from '../entites/role.entity';
import { FileServiceModule } from '../shared/file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address, Clinic, Role]), AuthModule, FileServiceModule],
  controllers: [StaffsController],
  providers: [StaffsService],
})
export class StaffsModule {}
