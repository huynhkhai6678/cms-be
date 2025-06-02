import { Module } from '@nestjs/common';
import { SmartPatientCardsService } from './smart-patient-cards.service';
import { SmartPatientCardsController } from './smart-patient-cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmartPatientCard } from '../entites/smart-patient-card.entity';
import { AuthModule } from '../auth/auth.module';
import { DatabaseServiceModule } from '../shared/database/database.module';
import { Setting } from '../entites/setting.entity';
import { Patient } from '../entites/patient.entity';
import { HelperModule } from '../helper/helper.module';
import { Address } from '../entites/address.entity';
import { PdfService } from '../shared/pdf/pdf.service';
import { Clinic } from '../entites/clinic.entity';
import { City } from '../entites/city.entity';
import { Country } from '../entites/country.entity';
import { State } from '../entites/state.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SmartPatientCard,
      Setting,
      Patient,
      Address,
      Clinic,
      City,
      Country,
      State
    ]),
    AuthModule,
    DatabaseServiceModule,
    HelperModule
  ],
  controllers: [SmartPatientCardsController],
  providers: [SmartPatientCardsService, PdfService],
})
export class SmartPatientCardsModule {}
