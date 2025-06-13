import { Controller, Get, Req, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuardFactory } from '../guards/role.guard.factory';
import { QueryParamsDto } from 'src/shared/dto/query-params.dto';

@UseGuards(AuthGuard, RoleGuardFactory('manage_report'))
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  @Get('sales')
  saleTable(@Query() query: QueryParamsDto) {
    return this.reportsService.saleTable(query);
  }

  @Get('services')
  serviceTable(@Query() query: QueryParamsDto) {
    return this.reportsService.serviceTable(query);
  }

  @Get('sale-pie-chart')
  saleChart(@Query() query: QueryParamsDto, @Req() request) {
    return this.reportsService.saleChart(query, request);
  }

  @Get('service-inventory-chart')
  serviceInventoryChart(@Query() query: QueryParamsDto, @Req() request) {
    return this.reportsService.serviceInventoryChart(query, request);
  }

  @Get('service-chart')
  serviceChart(@Query() query: QueryParamsDto, @Req() request) {
    return this.reportsService.serviceChart(query, request, 'Services');
  }

  @Get('inventory-chart')
  inventoryChart(@Query() query: QueryParamsDto, @Req() request) {
    return this.reportsService.serviceChart(query, request, 'Inventories');
  }
}
