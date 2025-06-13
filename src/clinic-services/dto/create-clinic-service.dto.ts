import { Transform } from 'class-transformer';
import { IsDefined, IsNumber, IsNumberString, IsString } from 'class-validator';

export class CreateClinicServiceDto {
  @IsDefined()
  @IsNumberString()
  category: number;

  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' && !isNaN(Number(value)) ? Number(value) : value,
  )
  @IsNumber()
  price: number;

  @IsNumberString()
  clinic_id: number;

  cost: number;
  description: string;
}
