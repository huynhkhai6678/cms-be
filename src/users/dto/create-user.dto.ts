import {
  IsArray,
  IsDefined,
  IsEmail,
  IsNumberString,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  @IsString()
  first_name: string;

  @IsDefined()
  @IsString()
  last_name: string;

  @IsDefined()
  @IsEmail()
  @IsString()
  email: string;

  @IsDefined()
  phone: {
    e164Number: string;
    dialCode: string;
  };

  @IsDefined()
  @IsString()
  password: string;

  @IsDefined()
  @IsString()
  confirm_password: string;

  @IsDefined()
  @IsArray()
  clinic_ids: number[];

  @IsDefined()
  @IsNumberString()
  clinic_chain_id: number;
}
