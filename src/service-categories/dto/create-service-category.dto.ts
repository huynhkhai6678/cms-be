import { IsDefined, IsNumberString, IsString } from 'class-validator';

export class CreateServiceCategoryDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsNumberString()
  clinic_id?: number;
}
