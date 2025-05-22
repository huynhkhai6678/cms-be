import {
  IsDefined,
  IsNumberString,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateSliderDto {
  @IsDefined()
  @IsString()
  title: string;

  @IsDefined()
  @IsString()
  @MaxLength(50, { message: 'Answer must be at most 50 characters long' })
  short_description: string;

  @IsNumberString()
  clinic_id?: number;
}
