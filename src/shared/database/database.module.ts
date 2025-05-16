import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { Permission } from 'src/roles/entities/permission.entity';
import { RoleHasPermission } from 'src/roles/entities/role-has-permission.entity';

@Module({
    imports : [
        TypeOrmModule.forFeature([
            Role,
            Permission,
            RoleHasPermission,
        ]),
    ],
    providers: [DatabaseService],
    exports: [DatabaseService]
})
export class DatabaseServiceModule {

}