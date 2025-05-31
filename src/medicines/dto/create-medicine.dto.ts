import { IsNotEmpty, IsOptional, IsString, IsNumber, MinLength, IsNumberString } from 'class-validator';

export class CreateMedicineDto {
  @IsNotEmpty()
  clinic_ids: string;

  @IsOptional()
  clinic_id: number;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsOptional()
  category_ids?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  salt_composition?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  brand_ids?: string;

  @IsOptional()
  buying_price?: number;

  @IsOptional()
  selling_price?: number;

  @IsOptional()
  @IsString()
  default_dispense?: string;

  @IsOptional()
  @IsString()
  uom?: string;

  @IsOptional()
  @IsString()
  dosage?: string;

  @IsOptional()
  @IsString()
  frequency?: string;

  @IsOptional()
  @IsString()
  administration?: string;

  @IsOptional()
  @IsString()
  purpose?: string;

  @IsOptional()
  @IsString()
  side_effects?: string;

  @IsOptional()
  @IsString()
  packing?: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsString()
  inventory_image?: string;

  image : File;

  @IsOptional()
  low_stock_level?: number;

  @IsOptional()
  reorder_level?: number;

  @IsOptional()
  expiration_warning?: number;
}
