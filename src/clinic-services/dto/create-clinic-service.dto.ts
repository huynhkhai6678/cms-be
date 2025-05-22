import { Transform } from 'class-transformer';
import {
  IsDecimal,
  IsDefined,
  IsNumber,
  IsNumberString,
  IsString,
} from 'class-validator';

export class CreateClinicServiceDto {
  @IsDefined()
  @IsNumberString()
  category: number;

  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @Transform(({ value }) =>
    typeof value === 'string' && !isNaN(Number(value)) ? Number(value) : value,
  )
  @IsNumber()
  price: number;

  @IsNumberString()
  clinic_id: number;

  cost: number;
  description: string;
}
