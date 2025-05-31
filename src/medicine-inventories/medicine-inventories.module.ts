import { Module } from '@nestjs/common';
import { MedicineInventoriesService } from './medicine-inventories.service';
import { MedicineInventoriesController } from './medicine-inventories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseServiceModule } from '../shared/database/database.module';
import { AuthModule } from '../auth/auth.module';
import { Medicine } from '../entites/medicine.entity';
import { MedicineInventory } from 'src/entites/medicine-inventory.entity';
import { MedicineInventoryUsage } from 'src/entites/medicine-inventory-usage.entity';
import { ShareMedicineServiceModule } from 'src/shared/share-medicine/share-medicine.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Medicine,
      MedicineInventory,
      MedicineInventoryUsage,
    ]),
    ShareMedicineServiceModule,
    AuthModule,
    DatabaseServiceModule,
  ],
  controllers: [MedicineInventoriesController],
  providers: [MedicineInventoriesService],
})
export class MedicineInventoriesModule {}
