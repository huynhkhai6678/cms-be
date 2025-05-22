import { IsDefined, IsNumber, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsDefined()
  @IsString()
  first_name;

  @IsDefined()
  @IsString()
  last_name;

  @IsDefined()
  @IsString()
  email;

  @IsDefined()
  @IsNumber()
  time_zone;

  @IsDefined()
  phone: {
    e164Number: string;
    dialCode: string;
  };

  @IsDefined()
  @IsNumber()
  gender;

  @IsString()
  dob;

  @IsNumber()
  blood_group;

  @IsString()
  address1;

  @IsString()
  address2;

  @IsNumber()
  country_id;

  @IsNumber()
  city_id;

  @IsNumber()
  postal_code;
}
