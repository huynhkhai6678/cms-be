import { Module } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CurrenciesController } from './currencies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from './entities/currency.entity';
import { DatabaseServiceModule } from 'src/shared/database/database.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports : [
    TypeOrmModule.forFeature([Currency]),
    DatabaseServiceModule,
    AuthModule
  ],
  controllers: [CurrenciesController],
  providers: [CurrenciesService],
})
export class CurrenciesModule {}
