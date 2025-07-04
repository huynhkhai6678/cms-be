import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { MedicineInventoryUsagesService } from './medicine-inventory-usages.service';
import { CreateMedicineInventoryUsageDto } from './dto/create-medicine-inventory-usage.dto';
import { UpdateMedicineInventoryUsageDto } from './dto/update-medicine-inventory-usage.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuardFactory } from '../guards/role.guard.factory';

@UseGuards(AuthGuard, RoleGuardFactory('manage_medicines'))
@Controller('medicine-inventory-usages')
export class MedicineInventoryUsagesController {
  constructor(
    private readonly medicineInventoryUsagesService: MedicineInventoryUsagesService,
  ) {}

  @Post()
  create(
    @Body(ValidationPipe)
    createMedicineInventoryUsageDto: CreateMedicineInventoryUsageDto,
  ) {
    return this.medicineInventoryUsagesService.create(
      createMedicineInventoryUsageDto,
    );
  }

  @Get()
  findAll(@Query() query) {
    return this.medicineInventoryUsagesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.medicineInventoryUsagesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body(ValidationPipe)
    updateMedicineInventoryUsageDto: UpdateMedicineInventoryUsageDto,
  ) {
    return this.medicineInventoryUsagesService.update(
      +id,
      updateMedicineInventoryUsageDto,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.medicineInventoryUsagesService.remove(+id);
  }
}
