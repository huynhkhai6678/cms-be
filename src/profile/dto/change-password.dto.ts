import { IsDefined, IsString, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsDefined()
  @IsString()
  current_password: string;

  @IsDefined()
  @IsString()
  new_password: string;

  @IsDefined()
  @IsString()
  @Matches('password')
  confirm_password: string;
}
