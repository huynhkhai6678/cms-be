import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from '../entites/brand.entity';
import { AuthModule } from '../auth/auth.module';
import { DatabaseServiceModule } from '../shared/database/database.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Brand]),
    AuthModule,
    DatabaseServiceModule,
  ],
  controllers: [BrandsController],
  providers: [BrandsService],
})
export class BrandsModule {}
