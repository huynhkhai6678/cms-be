import {
  IsString,
  IsOptional,
  IsNumberString,
} from 'class-validator';

export class CreateNotificationDto {
  @IsOptional()
  @IsNumberString()
  user_id: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  type?: string;
}
