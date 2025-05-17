import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../../entites/role.entity';
import { Permission } from '../../entites/permission.entity';
import { RoleHasPermission } from '../../entites/role-has-permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, RoleHasPermission])],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseServiceModule {}
