import { Module } from '@nestjs/common';
import { ServiceCategoriesService } from './service-categories.service';
import { ServiceCategoriesController } from './service-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { DatabaseServiceModule } from '../shared/database/database.module';
import { ServiceCategory } from '../entites/service-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceCategory]),
    AuthModule,
    DatabaseServiceModule,
  ],
  controllers: [ServiceCategoriesController],
  providers: [ServiceCategoriesService],
})
export class ServiceCategoriesModule {}
