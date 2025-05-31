import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { MedicineInventoriesService } from './medicine-inventories.service';
import { CreateMedicineInventoryDto } from './dto/create-medicine-inventory.dto';
import { UpdateMedicineInventoryDto } from './dto/update-medicine-inventory.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuardFactory } from '../guards/role.guard.factory';
import { I18nService } from 'nestjs-i18n';

@UseGuards(AuthGuard, RoleGuardFactory('manage_medicines'))
@Controller('medicine-inventories')
export class MedicineInventoriesController {
  constructor(private readonly medicineInventoriesService: MedicineInventoriesService, private i18n : I18nService) {}

  @Post()
  async create(@Body(new ValidationPipe()) createMedicineInventoryDto: CreateMedicineInventoryDto) {
    await this.medicineInventoriesService.create(createMedicineInventoryDto);
  }

  @Get()
  findAll(@Query() query) {
    return this.medicineInventoriesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicineInventoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(new ValidationPipe()) updateMedicineInventoryDto: UpdateMedicineInventoryDto) {
    return this.medicineInventoriesService.update(+id, updateMedicineInventoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicineInventoriesService.remove(+id);
  }
}
