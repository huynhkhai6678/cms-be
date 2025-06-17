import {
  IsDefined,
  IsEmail,
  IsString,
} from 'class-validator';

export class ForgotPasswordDto {
    @IsDefined()
    @IsString()
    @IsEmail()
    email: string;
}
