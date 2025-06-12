import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { MedicalRecordService } from './medical-record.service';
import { AuthGuard } from '../../guards/auth.guard';
import { RoleGuardFactory } from '../../guards/role.guard.factory';
import { CreateNoteDto } from './dto/create-note-dto';
import { UpdateNoteDto } from './dto/update-note-dto';
import { I18nService } from 'nestjs-i18n';

@UseGuards(AuthGuard, RoleGuardFactory('manage_patients'))
@Controller('patient-medical-record')
export class MedicalRecordController {
  constructor(private readonly medicalRecordService: MedicalRecordService, private i18n: I18nService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.medicalRecordService.findOne(+id);
  }

  @Get('histories/:id')
  findHistories(@Param('id', ParseIntPipe) id: string) {
    return this.medicalRecordService.findHistories(+id);
  }

  @Get('histories/:id')
  post(@Param('id', ParseIntPipe) id: string) {
    return this.medicalRecordService.findHistories(+id);
  }

  @Post('notes')
  async createHistory(@Body(ValidationPipe) createNoteDto: CreateNoteDto, @Req() request : any) {
    await this.medicalRecordService.createNote(createNoteDto, request.user);
    return {
      message: this.i18n.t('main.messages.medical_record.update_note_success'),
    }
  }

  @Patch('notes/:id')
  async updateHistory(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) updateNoteDto: UpdateNoteDto, @Req() request : any) {
    await this.medicalRecordService.updateNote(+id, updateNoteDto, request.user);
    return {
      message: this.i18n.t('main.messages.medical_record.update_note_success'),
    };
  }
  
  @Delete('notes/:id')
  async removeHistory(@Param('id', ParseIntPipe) id: string) {
    await this.medicalRecordService.removeNote(+id);
    return {
      message: this.i18n.t('main.messages.medical_record.delete'),
    };
  }
  
}
