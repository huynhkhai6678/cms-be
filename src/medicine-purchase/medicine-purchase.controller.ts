import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Res } from '@nestjs/common';
import { MedicinePurchaseService } from './medicine-purchase.service';
import { CreateMedicinePurchaseDto } from './dto/create-medicine-purchase.dto';
import { UpdateMedicinePurchaseDto } from './dto/update-medicine-purchase.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuardFactory } from '../guards/role.guard.factory';
import { ExcelService } from 'src/shared/excel/excel.service';

@UseGuards(AuthGuard, RoleGuardFactory('manage_medicines'))
@Controller('medicine-purchase')
export class MedicinePurchaseController {
  constructor(private readonly medicinePurchaseService: MedicinePurchaseService, private readonly excelService: ExcelService) {}

  @Post()
  create(@Body() createMedicinePurchaseDto: CreateMedicinePurchaseDto) {
    return this.medicinePurchaseService.create(createMedicinePurchaseDto);
  }

  @Get()
  findAll(@Query() query) {
    return this.medicinePurchaseService.findAll(query);
  }

  @Get('get-selection/:id')
  getAllSelect(@Param('id') id: string) {
    return this.medicinePurchaseService.getAllSelect(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicinePurchaseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMedicinePurchaseDto: UpdateMedicinePurchaseDto) {
    return this.medicinePurchaseService.update(+id, updateMedicinePurchaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicinePurchaseService.remove(+id);
  }

  @Get('export')
  async export(@Res() res) {
    const buffer = await this.excelService.generateExcel();

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=report.xlsx',
    }).send(buffer);
  }
}
