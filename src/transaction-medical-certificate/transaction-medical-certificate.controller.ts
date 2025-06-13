import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Res,
  ParseIntPipe,
} from '@nestjs/common';
import { TransactionMedicalCertificateService } from './transaction-medical-certificate.service';
import { CreateTransactionMedicalCertificateDto } from './dto/create-transaction-medical-certificate.dto';
import { UpdateTransactionMedicalCertificateDto } from './dto/update-transaction-medical-certificate.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuardFactory } from '../guards/role.guard.factory';
import { Response } from 'express';

@UseGuards(AuthGuard, RoleGuardFactory('manage_transactions'))
@Controller('transaction-medical-certificate')
export class TransactionMedicalCertificateController {
  constructor(
    private readonly transactionMedicalCertificateService: TransactionMedicalCertificateService,
  ) {}

  @Post()
  create(
    @Body(ValidationPipe)
    createTransactionMedicalCertificateDto: CreateTransactionMedicalCertificateDto,
  ) {
    return this.transactionMedicalCertificateService.create(
      createTransactionMedicalCertificateDto,
    );
  }

  @Get('export/:id')
  async export(@Param('id', ParseIntPipe) id: string, @Res() res: Response) {
    const pdfBuffer =
      await this.transactionMedicalCertificateService.export(+id);
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
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.transactionMedicalCertificateService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body(ValidationPipe)
    updateTransactionMedicalCertificateDto: UpdateTransactionMedicalCertificateDto,
  ) {
    return this.transactionMedicalCertificateService.update(
      +id,
      updateTransactionMedicalCertificateDto,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.transactionMedicalCertificateService.remove(+id);
  }
}
