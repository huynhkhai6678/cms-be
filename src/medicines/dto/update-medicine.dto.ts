import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicineDto } from './create-medicine.dto';
import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpdateMedicineDto extends PartialType(CreateMedicineDto) {
  @IsOptional() // Mark as optional for update
  @IsString()
  @ValidateIf((o) => o.clinic_ids !== undefined)
  clinic_ids?: string; // Optional for update

  @IsNotEmpty()
  clinic_id: number;
}
