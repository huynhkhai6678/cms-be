import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicineInventoryDto } from './create-medicine-inventory.dto';

export class UpdateMedicineInventoryDto extends PartialType(CreateMedicineInventoryDto) {}
