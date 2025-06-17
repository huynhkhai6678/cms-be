import { Transform } from 'class-transformer';
import { IsDefined, IsNumber, IsNumberString, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsDefined()
  @IsString()
  first_name : string;

  @IsDefined()
  @IsString()
  last_name : string;

  @IsDefined()
  @IsString()
  email : string;

  @IsDefined()
  @IsNumberString()
  time_zone : number;

  @IsDefined()
  @IsString()
  contact: string;

  @IsDefined()
  @IsString()
  region_code: string;

  @Transform(({ value }) => {
    return typeof value === 'string' ? Number(value) : value;
  })
  @IsDefined()
  @IsNumber()
  gender: number;

  @IsString()
  dob : string;

  @Transform(({ value }) => {
    return typeof value === 'string' ? Number(value) : value;
  })
  @IsNumber()
  blood_group : string;

  @IsString()
  address1 : string;

  @IsString()
  address2 : string;

  @Transform(({ value }) => {
    return typeof value === 'string' ? Number(value) : value;
  })
  @IsNumber()
  country_id : number;

  @Transform(({ value }) => {
    return typeof value === 'string' ? Number(value) : value;
  })
  @IsNumber()
  state_id : number;

  @Transform(({ value }) => {
    return typeof value === 'string' ? Number(value) : value;
  })
  @IsNumber()
  city_id : number;

  @Transform(({ value }) => {
    return typeof value === 'string' ? Number(value) : value;
  })
  @IsNumber()
  postal_code : number;
}
