import { Module } from '@nestjs/common';
import { LabelsService } from './labels.service';
import { LabelsController } from './labels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Label } from '../entites/label.entity';
import { AuthModule } from '../auth/auth.module';
import { DatabaseServiceModule } from '../shared/database/database.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Label]),
    AuthModule,
    DatabaseServiceModule,
  ],
  controllers: [LabelsController],
  providers: [LabelsService],
})
export class LabelsModule {}
