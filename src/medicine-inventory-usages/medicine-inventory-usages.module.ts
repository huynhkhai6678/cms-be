import { Module } from '@nestjs/common';
import { MedicineInventoryUsagesService } from './medicine-inventory-usages.service';
import { MedicineInventoryUsagesController } from './medicine-inventory-usages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { DatabaseServiceModule } from '../shared/database/database.module';
import { MedicineInventoryUsage } from '../entites/medicine-inventory-usage.entity';
import { ShareMedicineServiceModule } from 'src/shared/share-medicine/share-medicine.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MedicineInventoryUsage,
    ]),
    AuthModule,
    DatabaseServiceModule,
    ShareMedicineServiceModule
  ],
  controllers: [MedicineInventoryUsagesController],
  providers: [MedicineInventoryUsagesService],
})
export class MedicineInventoryUsagesModule {}
