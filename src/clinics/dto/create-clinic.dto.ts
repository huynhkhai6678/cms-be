import { IsDefined, IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateClinicDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsString()
  landing_name: string;

  @IsDefined()
  phone: {
    e164Number: string;
    dialCode: string;
  };

  @IsDefined()
  @IsString()
  region_code: string;

  @IsDefined()
  @IsString()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsNumber()
  type: number;

  @IsDefined()
  @IsNumber()
  address1: string;
  address2: string;
  postal_code: string;
  social_link: string;

  country_id: number;
  state_id: number;
  city_id: number;
}
