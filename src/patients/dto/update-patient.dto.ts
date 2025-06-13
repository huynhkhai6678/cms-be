import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientDto } from './create-patient.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePatientDto extends PartialType(CreatePatientDto) {
  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  confirm_password: string;
}
