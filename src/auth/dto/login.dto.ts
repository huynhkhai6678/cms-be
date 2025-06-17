import {
  IsDefined,
  IsEmail,
  IsString,
} from 'class-validator';

export class LoginDto {
    @IsDefined()
    @IsString()
    password: string;

    @IsDefined()
    @IsString()
    @IsEmail()
    email: string;
}
