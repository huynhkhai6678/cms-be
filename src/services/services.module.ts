import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from '../entites/service.entity';
import { ServiceCategory } from '../entites/service-category.entity';
import { AuthModule } from '../auth/auth.module';
import { DatabaseServiceModule } from '../shared/database/database.module';
import { Doctor } from '../entites/doctor.entity';
import { UserClinic } from '../entites/user-clinic.entity';
import { User } from '../entites/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Service,
      ServiceCategory,
      Doctor,
      UserClinic,
      User,
    ]),
    AuthModule,
    DatabaseServiceModule,
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
