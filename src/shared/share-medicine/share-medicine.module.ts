import { Module } from '@nestjs/common';
import { ShareMedicineService } from './share-medicine.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medicine } from '../../entites/medicine.entity';
import { MedicineInventory } from '../../entites/medicine-inventory.entity';
import { WebsocketModule } from '../../websocket/websocket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Medicine,
      MedicineInventory,
    ]),
    WebsocketModule
  ],
  providers: [ShareMedicineService],
  exports: [ShareMedicineService],
})
export class ShareMedicineServiceModule {}
