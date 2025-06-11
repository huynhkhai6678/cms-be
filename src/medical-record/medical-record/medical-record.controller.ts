import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MedicalRecordService } from './medical-record.service';
import { AuthGuard } from '../../guards/auth.guard';
import { RoleGuardFactory } from '../../guards/role.guard.factory';

@UseGuards(AuthGuard, RoleGuardFactory('manage_patients'))
@Controller('patient-medical-record')
export class MedicalRecordController {
  constructor(private readonly medicalRecordService: MedicalRecordService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicalRecordService.findOne(+id);
  }
  
}
