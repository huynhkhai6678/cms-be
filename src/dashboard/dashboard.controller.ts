import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { Request } from 'express';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private prisma: PrismaService,
    private dashboardService: DashboardService,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async index(@Req() request) {
    const user = request.user;
    const user_card = await this.dashboardService.getUserCardData(user);
    const appointment_card =
      await this.dashboardService.getUpcommingAppointmentData(user);
    const visit_card = await this.dashboardService.getVisitCard(user);

    return {
      data: {
        user_card,
        appointment_card,
        visit_card,
      },
    };
  }

  @UseGuards(AuthGuard)
  @Get('admin-revenue')
  async adminRevenue(@Req() request: Request) {
    const user = await this.prisma.users.findUnique({
      where: {
        id: 90,
      },
      include: {
        doctor: true,
        patient: true,
      },
    });

    const data = await this.dashboardService.getAdminRevenueData(user, request);
    return {
      data,
    };
  }
}
