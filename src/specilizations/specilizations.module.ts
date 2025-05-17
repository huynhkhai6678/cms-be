import { Module } from '@nestjs/common';
import { SpecilizationsService } from './specilizations.service';
import { SpecilizationsController } from './specilizations.controller';

@Module({
  controllers: [SpecilizationsController],
  providers: [SpecilizationsService],
})
export class SpecilizationsModule {}
