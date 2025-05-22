import { IsDefined, IsEmail, IsString } from 'class-validator';

export class CreateSubscriberDto {
  @IsDefined()
  @IsString()
  @IsEmail()
  email;
}
