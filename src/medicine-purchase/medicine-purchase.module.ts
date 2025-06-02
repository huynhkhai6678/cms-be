import { Module } from '@nestjs/common';
import { MedicinePurchaseService } from './medicine-purchase.service';
import { MedicinePurchaseController } from './medicine-purchase.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseMedicine } from '../entites/purchase-medicines.entity';
import { PurchasedMedicine } from '../entites/purchased-medicines.entity';
import { AuthModule } from '../auth/auth.module';
import { DatabaseServiceModule } from '../shared/database/database.module';
import { ExcelService } from '../shared/excel/excel.service';
import { Label } from '../entites/label.entity';
import { Brand } from '../entites/brand.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchaseMedicine,
      PurchasedMedicine,
      Label,
      Brand
    ]),
    AuthModule,
    DatabaseServiceModule,
  ],
  controllers: [MedicinePurchaseController],
  providers: [MedicinePurchaseService, ExcelService],
})
export class MedicinePurchaseModule {}
