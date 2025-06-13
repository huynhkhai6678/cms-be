import { Module } from '@nestjs/common';
import { ShareMedicineService } from './share-medicine.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medicine } from '../../entites/medicine.entity';
import { MedicineInventory } from '../../entites/medicine-inventory.entity';
import { MedicineInventoryUsage } from '../../entites/medicine-inventory-usage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Medicine,
      MedicineInventory,
      MedicineInventoryUsage,
    ]),
  ],
  providers: [ShareMedicineService],
  exports: [ShareMedicineService],
})
export class ShareMedicineServiceModule {}
