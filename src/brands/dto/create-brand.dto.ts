import {
  IsDefined,
  IsEmail,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBrandDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsOptional()
  contact: {
    e164Number: string;
    dialCode: string;
  };

  phone: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  contact_person: string;

  @IsOptional()
  @IsString()
  payment_terms: string;

  @IsOptional()
  @IsString()
  website: string;

  @IsOptional()
  @IsString()
  comment: string;

  @IsOptional()
  @IsNumberString()
  clinic_id: number;
}
