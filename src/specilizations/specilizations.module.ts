import { Module } from '@nestjs/common';
import { SpecilizationsService } from './specilizations.service';
import { SpecilizationsController } from './specilizations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialization } from '../entites/specilization.entity';
import { AuthModule } from '../auth/auth.module';
import { DatabaseServiceModule } from '../shared/database/database.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Specialization]),
    AuthModule,
    DatabaseServiceModule,
  ],
  controllers: [SpecilizationsController],
  providers: [SpecilizationsService],
})
export class SpecilizationsModule {}
