import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Res, ValidationPipe } from '@nestjs/common';
import { MedicinePurchaseService } from './medicine-purchase.service';
import { CreateMedicinePurchaseDto } from './dto/create-medicine-purchase.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuardFactory } from '../guards/role.guard.factory';
import { ExcelService } from 'src/shared/excel/excel.service';
import { I18nService } from 'nestjs-i18n';
import { PurchaseMedicine } from 'src/entites/purchase-medicines.entity';

@UseGuards(AuthGuard, RoleGuardFactory('manage_medicines'))
@Controller('medicine-purchase')
export class MedicinePurchaseController {
  constructor(private readonly medicinePurchaseService: MedicinePurchaseService, private readonly excelService: ExcelService, private i18n : I18nService) {}

  @Post()
  create(@Body(new ValidationPipe()) createMedicinePurchaseDto: CreateMedicinePurchaseDto) {
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

  @Get('export/:id')
  async export(@Param('id') id: string, @Res() res) {
    const data = await this.medicinePurchaseService.getMedicineForExport(+id);

    const TYPES = {
      1: 'Cash',
      2: 'Cheque',
      3: 'Other',
    }

    const sheetName = 'User Data';
    const headers = [
      { header: this.i18n.t('main.messages.common.no'), key: 'no', width: 30 },
      { header: this.i18n.t('main.messages.purchase_medicine.purchase_number'), key: 'purchase_no', width: 30 },
      { header: this.i18n.t('main.messages.purchase_medicine.tax'), key: 'tax', width: 30 },
      { header: this.i18n.t('main.messages.purchase_medicine.discount'), key: 'discount', width: 30 },
      { header: this.i18n.t('main.messages.purchase_medicine.net_amount'), key: 'net_amount', width: 30 },
      { header: this.i18n.t('main.messages.purchase_medicine.payment_mode'), key: 'payment_mode', width: 30 },
    ];

    console

    const excelData : any[] = [];
    data.forEach((purchase : PurchaseMedicine, index : number) => {
      excelData.push({
        no : index + 1,
        purchase_no : `#${purchase.purchase_no}`,
        tax : purchase.tax ? purchase.tax : 'N/A',
        discount : purchase.discount ? purchase.discount : 'N/A',
        net_amount : purchase.net_amount ? purchase.net_amount : 'N/A',
        payment_mode : TYPES[purchase.payment_type]
      })
    });

    const buffer = await this.excelService.generateExcel(sheetName, headers, excelData);

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=report.xlsx',
    }).send(buffer);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicinePurchaseService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicinePurchaseService.remove(+id);
  }
}
