import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private dashboardService: DashboardService,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async index(@Req() request, @Query() queryParams) {
    const user = request.user;
    const user_card = await this.dashboardService.getUserCardData(user, queryParams);
    const appointment_card = await this.dashboardService.getUpcommingAppointmentData(user, queryParams);
    const visit_card = await this.dashboardService.getVisitCard(user, queryParams);

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
  async adminRevenue(@Query() query) {
    const data = await this.dashboardService.getAdminRevenueData(query);
    return {
      data,
    };
  }

  @UseGuards(AuthGuard)
  @Get('doctor-appointment-chart')
  async getDoctorAppointment(@Req() request) {
    const data = await this.dashboardService.getDoctorAppointmentData(request);
    return {
      data,
    };
  }
  
  @UseGuards(AuthGuard)
  @Get('patient-register')
  patientRegister(@Query() query : any) {
    return this.dashboardService.patientRegister(query);
  }

  @UseGuards(AuthGuard)
  @Get('doctor-appointment/:id')
  doctorAppointment(@Req() request : any, @Param('id') clinicId: number, @Query() query : any) {
    const user = request.user;
    return this.dashboardService.doctorAppointment(user.id, clinicId, query);
  }

  @UseGuards(AuthGuard)
  @Get('patient-today-appointment')
  patientTodayAppointment(@Req() request : any, @Query() query : any) {
    const user = request.user;
    return this.dashboardService.patientTodayAppointment(user.id, user.clinic_id, query);
  }

  @UseGuards(AuthGuard)
  @Get('patient-upcomming-appointment')
  patientUpcommingAppointment(@Req() request : any, @Query() query : any) {
    const user = request.user;
    return this.dashboardService.patientUpcommingAppointment(user.id, user.clinic_id, query);
  }
}
