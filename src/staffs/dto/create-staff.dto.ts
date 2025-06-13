import { IsDefined, IsNumberString, IsString } from 'class-validator';

export class CreateStaffDto {
  @IsDefined()
  @IsString()
  first_name: string;

  @IsDefined()
  @IsString()
  last_name: string;

  @IsDefined()
  @IsString()
  email: string;

  @IsDefined()
  @IsString()
  password: string;

  @IsDefined()
  @IsString()
  confirm_password: string;

  @IsDefined()
  @IsString()
  contact: string;

  @IsDefined()
  @IsString()
  region_code: string;

  @IsDefined()
  @IsNumberString()
  type: number;

  @IsDefined()
  gender: number;

  @IsDefined()
  clinic_ids: string;

  avatar: File;
}
