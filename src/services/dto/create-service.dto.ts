import { Transform } from 'class-transformer';
import { IsDefined, IsNumber, IsNumberString, IsString } from 'class-validator';

export class CreateServiceDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsString()
  short_description: string;

  @IsDefined()
  status: number;

  @IsDefined()
  @IsNumberString()
  category_id: number;

  @IsDefined()
  @IsString()
  doctor_ids: string;

  @IsDefined()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' && !isNaN(Number(value)) ? Number(value) : value,
  )
  @IsNumber()
  charges: number;

  @IsNumberString()
  clinic_id?: number;

  logo: File;
}
