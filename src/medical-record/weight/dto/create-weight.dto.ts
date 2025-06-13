import { IsDefined, IsNumber, IsNumberString, IsString } from 'class-validator';

export class CreateWeightDto {
  @IsDefined()
  @IsNumberString()
  patient_medical_record_id: number;

  @IsDefined()
  @IsNumber()
  weight: number;

  @IsDefined()
  @IsString()
  date: string;
}
