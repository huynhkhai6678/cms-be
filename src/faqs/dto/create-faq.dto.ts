import {
  IsDefined,
  IsNumberString,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateFaqDto {
  @IsDefined()
  @IsString()
  question: string;

  @IsDefined()
  @IsString()
  @MaxLength(1000, { message: 'Answer must be at most 1000 characters long' })
  answer: string;

  @IsNumberString()
  clinic_id?: number;
}
