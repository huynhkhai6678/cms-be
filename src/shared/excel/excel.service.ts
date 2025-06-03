import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExcelService {
  async generateExcel(sheetName: string, headers: { header: string, key: string, width: number }[], data: any[]) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    worksheet.columns = headers;

    data.forEach(item => {
      worksheet.addRow(item);
    });

    const uint8Array = await workbook.xlsx.writeBuffer();
    const buffer = Buffer.from(uint8Array);
    return buffer;
  }
}
