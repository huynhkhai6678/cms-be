import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { PrismaServiceModule } from 'src/shared/prisma/prisma.module';

@Module({
  imports: [PrismaServiceModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
