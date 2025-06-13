import { IsDefined, IsString } from 'class-validator';

export class CreateDoctorDto {
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
  specialization_ids: string;

  @IsDefined()
  @IsString()
  dob: string;

  @IsDefined()
  experience: number;

  @IsDefined()
  status: boolean;

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
  gender: number;

  @IsDefined()
  clinic_ids: string;

  avatar: File;
}
