import { IsDefined, IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreateSpecilizationDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumberString()
  clinic_id?: number;
}
