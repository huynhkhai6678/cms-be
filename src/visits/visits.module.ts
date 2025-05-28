import { Module } from '@nestjs/common';
import { VisitsService } from './visits.service';
import { VisitsController } from './visits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visit } from '../entites/visit.entity';
import { AuthModule } from '../auth/auth.module';
import { HelperModule } from '../helper/helper.module';

@Module({
  imports: [TypeOrmModule.forFeature([Visit]), AuthModule, HelperModule],
  controllers: [VisitsController],
  providers: [VisitsService],
})
export class VisitsModule {}
