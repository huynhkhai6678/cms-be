import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { SmartPatientCardsService } from './smart-patient-cards.service';
import { CreateSmartPatientCardDto } from './dto/create-smart-patient-card.dto';
import { UpdateSmartPatientCardDto } from './dto/update-smart-patient-card.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuardFactory } from '../guards/role.guard.factory';

@UseGuards(AuthGuard, RoleGuardFactory('manage_patients'))
@Controller('smart-patient-cards')
export class SmartPatientCardsController {
  constructor(private readonly smartPatientCardsService: SmartPatientCardsService) {}

  @Post()
  create(@Body() createSmartPatientCardDto: CreateSmartPatientCardDto) {
    return this.smartPatientCardsService.create(createSmartPatientCardDto);
  }

  @Get()
  findAll(@Query() query) {
    return this.smartPatientCardsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.smartPatientCardsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSmartPatientCardDto: UpdateSmartPatientCardDto) {
    return this.smartPatientCardsService.update(+id, updateSmartPatientCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.smartPatientCardsService.remove(+id);
  }
}
