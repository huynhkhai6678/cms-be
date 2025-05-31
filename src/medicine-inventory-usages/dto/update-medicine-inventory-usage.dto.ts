import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicineInventoryUsageDto } from './create-medicine-inventory-usage.dto';

export class UpdateMedicineInventoryUsageDto extends PartialType(CreateMedicineInventoryUsageDto) {}
