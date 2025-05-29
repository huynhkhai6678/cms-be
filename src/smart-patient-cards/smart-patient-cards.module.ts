import { Module } from '@nestjs/common';
import { SmartPatientCardsService } from './smart-patient-cards.service';
import { SmartPatientCardsController } from './smart-patient-cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmartPatientCard } from 'src/entites/smart-patient-card.entity';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseServiceModule } from 'src/shared/database/database.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SmartPatientCard
    ]),
    AuthModule,
    DatabaseServiceModule,
  ],
  controllers: [SmartPatientCardsController],
  providers: [SmartPatientCardsService],
})
export class SmartPatientCardsModule {}
