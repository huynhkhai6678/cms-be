import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ValidationPipe, Res } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuardFactory } from '../guards/role.guard.factory';
import { I18nService } from 'nestjs-i18n';

@UseGuards(AuthGuard, RoleGuardFactory('manage_transactions'))
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService, private i18n : I18nService) {}

  @Post()
  async create(@Body(new ValidationPipe()) createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  findAll(@Query() query) {
    return this.transactionsService.findAll(query);
  }

  @Get('get-selection/:id')
  getAllSelect(@Param('id') id: string) {
    return this.transactionsService.getAllSelect(+id);
  }

  @Get('get-services/:id')
  getTransactionService(@Param('id') id: string) {
    return this.transactionsService.getTransactionService(+id);
  }

  @Get('export-invoice/:id')
  async exportInvoice(@Param('id') id: string, @Res() res) {
    const pdfBuffer = await this.transactionsService.exportInvoice(+id);
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

  @Get('export-receipt/:id')
  async exportReceipt(@Param('id') id: string, @Res() res) {
    const pdfBuffer = await this.transactionsService.exportReceipt(+id);
    if (!pdfBuffer) {
      res.status(404).send('PDF not generated');
      return;
    }
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="receipt.pdf"',
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body(new ValidationPipe()) updateTransactionDto: UpdateTransactionDto) {
    return  this.transactionsService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.transactionsService.remove(+id);
    return {
      message : this.i18n.t('main.messages.transaction.deleted_successfully')
    }
  }
}
