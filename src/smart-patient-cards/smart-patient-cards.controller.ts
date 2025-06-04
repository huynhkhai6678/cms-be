import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ValidationPipe, Res } from '@nestjs/common';
import { SmartPatientCardsService } from './smart-patient-cards.service';
import { CreateSmartPatientCardDto } from './dto/create-smart-patient-card.dto';
import { UpdateSmartPatientCardDto } from './dto/update-smart-patient-card.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuardFactory } from '../guards/role.guard.factory';
import { I18nService } from 'nestjs-i18n';
import { CreatePatientSmartPatientCardDto } from './dto/create-patient-smart-patient-card.dto';

@UseGuards(AuthGuard, RoleGuardFactory('manage_patients'))
@Controller('smart-patient-cards')
export class SmartPatientCardsController {
  constructor(private readonly smartPatientCardsService: SmartPatientCardsService, private i18n: I18nService) {}

  @Post()
  async create(@Body(new ValidationPipe()) createSmartPatientCardDto: CreateSmartPatientCardDto) {
    await this.smartPatientCardsService.create(createSmartPatientCardDto);
    return {
      message: this.i18n.translate('messages.smart_patient_card.template_create'),
    };
  }

  @Get()
  findAll(@Query() query) {
    return this.smartPatientCardsService.findAll(query);
  }

  @Get('patient-card')
  findPatientCard(@Query() query) {
    return this.smartPatientCardsService.findPatientCard(query);
  }

  @Get('template-by-clinic/:clinicId')
  async templateByClinic(@Param('clinicId') clinicId: string) {
    const data = await this.smartPatientCardsService.templateByClinic(+clinicId);
    return { data };
  }

  @Get('generate/:clinicId')
  generatePatientCard(@Param('clinicId') clinicId: string) {
    return this.smartPatientCardsService.generatePatientCard(+clinicId);
  }

  @Get('show/:id')
  showPatientCard(@Param('id') id: string) {
    return this.smartPatientCardsService.showPatientCard(+id);
  }

  @Get('export/:id')
  async export(@Param('id') id: string, @Res() res) {
    const pdfBuffer = await this.smartPatientCardsService.export(+id);

    if (!pdfBuffer) {
      res.status(404).send('PDF not generated');
      return;
    }
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="invoice.pdf"',
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('clinic_id') clinicId : number) {
    return this.smartPatientCardsService.findOne(+id, clinicId);
  }

  @Post('generate')
  createPatientCard(@Body(new ValidationPipe()) createPatientSmartPatientCardDto: CreatePatientSmartPatientCardDto) {
    return this.smartPatientCardsService.createPatientCard(createPatientSmartPatientCardDto);
  }

  @Post('update-entity/:id')
  async updateEntity(@Param('id') id: string, @Body() body) {
    await this.smartPatientCardsService.updateEntity(+id, body);
    return {
      message: this.i18n.t('main.messages.smart_patient_card.template_update'),
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSmartPatientCardDto: UpdateSmartPatientCardDto) {
    await this.smartPatientCardsService.update(+id, updateSmartPatientCardDto);
    return {
      message: this.i18n.t('main.messages.smart_patient_card.template_update'),
    };
  }

  @Delete('patient-card/:id')
  async removePatientCard(@Param('id') id: string) {
    await this.smartPatientCardsService.removePatientCard(+id);
    return {
      message: this.i18n.t('main.messages.smart_patient_card.template_delete'),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.smartPatientCardsService.remove(+id);
    return {
      message: this.i18n.t('main.messages.smart_patient_card.template_delete'),
    };
  }
}
