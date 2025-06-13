import { Module } from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { MedicinesController } from './medicines.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medicine } from '../entites/medicine.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Category } from '../entites/category.entity';
import { Brand } from '../entites/brand.entity';
import { Label } from '../entites/label.entity';
import { MedicineInventory } from '../entites/medicine-inventory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Medicine,
      MedicineInventory,
      Category,
      Brand,
      Label,
    ]),
    AuthModule,
  ],
  controllers: [MedicinesController],
  providers: [MedicinesService, MedicinesService],
})
export class MedicinesModule {}
