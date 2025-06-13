import { IsArray, IsDefined, IsString } from 'class-validator';

export class UpdateGenralDto {
  @IsDefined()
  @IsString()
  clinic_name: string;

  @IsDefined()
  @IsString()
  email: string;

  @IsDefined()
  phone: {
    e164Number: string;
    dialCode: string;
  };

  @IsDefined()
  @IsArray()
  specialities: [];

  @IsDefined()
  @IsString()
  front_color: number;

  @IsDefined()
  @IsArray()
  payment_gateways: [];
}
