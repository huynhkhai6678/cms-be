import { IsDefined, IsNumber, IsNumberString, IsString } from 'class-validator';

export class CreatePulseRateDto {
  @IsDefined()
  @IsNumberString()
  patient_medical_record_id: number;

  @IsDefined()
  @IsNumber()
  pulse: number;

  @IsDefined()
  @IsString()
  date: string;
}
