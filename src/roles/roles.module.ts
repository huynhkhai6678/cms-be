import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { DatabaseServiceModule } from '../shared/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';

@Module({
  imports: [    
    TypeOrmModule.forFeature([Role, Permission]),
    DatabaseServiceModule
  ],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
