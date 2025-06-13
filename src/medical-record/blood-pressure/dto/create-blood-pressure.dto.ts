import { IsDefined, IsNumber, IsNumberString, IsString } from 'class-validator';

export class CreateBloodPressureDto {
  @IsDefined()
  @IsNumberString()
  patient_medical_record_id: number;

  @IsDefined()
  @IsNumber()
  bp_systolic: number;

  @IsDefined()
  @IsNumber()
  bp_diastolic: number;

  @IsDefined()
  @IsString()
  date: string;
}
