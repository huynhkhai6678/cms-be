import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe, Res } from '@nestjs/common';
import { TransactionMedicalCertificateService } from './transaction-medical-certificate.service';
import { CreateTransactionMedicalCertificateDto } from './dto/create-transaction-medical-certificate.dto';
import { UpdateTransactionMedicalCertificateDto } from './dto/update-transaction-medical-certificate.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuardFactory } from '../guards/role.guard.factory';

@UseGuards(AuthGuard, RoleGuardFactory('manage_transactions'))
@Controller('transaction-medical-certificate')
export class TransactionMedicalCertificateController {
  constructor(private readonly transactionMedicalCertificateService: TransactionMedicalCertificateService) {}

  @Post()
  create(@Body(new ValidationPipe()) createTransactionMedicalCertificateDto: CreateTransactionMedicalCertificateDto) {
    return this.transactionMedicalCertificateService.create(createTransactionMedicalCertificateDto);
  }

  @Get('export/:id')
  async export(@Param('id') id: string, @Res() res) {
    const pdfBuffer = await this.transactionMedicalCertificateService.export(+id);
    if (!pdfBuffer) {
      res.status(404).send('PDF not generated');
      return;
    }
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="certificate.pdf"',
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionMedicalCertificateService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(new ValidationPipe()) updateTransactionMedicalCertificateDto: UpdateTransactionMedicalCertificateDto) {
    return this.transactionMedicalCertificateService.update(+id, updateTransactionMedicalCertificateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionMedicalCertificateService.remove(+id);
  }
}
