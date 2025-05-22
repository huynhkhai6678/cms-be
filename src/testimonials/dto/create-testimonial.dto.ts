import {
  IsDefined,
  IsNumberString,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTestimonialDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsString()
  designation: string;

  @IsDefined()
  @IsString()
  @MaxLength(111, { message: 'Answer must be at most 111 characters long' })
  short_description: string;

  @IsNumberString()
  clinic_id?: number;
}
