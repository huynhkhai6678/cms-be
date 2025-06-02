import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExcelService {
  async generateExcel(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');

    // Example headers and data
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
    ];

    // Sample data
    worksheet.addRow({ id: 1, name: 'John Doe', email: 'john@example.com' });
    worksheet.addRow({ id: 2, name: 'Jane Doe', email: 'jane@example.com' });

    const uint8Array = await workbook.xlsx.writeBuffer();
    const buffer = Buffer.from(uint8Array);
    return buffer;
  }
}
