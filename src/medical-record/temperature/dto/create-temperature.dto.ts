import { IsDefined, IsNumber, IsNumberString, IsString } from 'class-validator';

export class CreateTemperatureDto {
  @IsDefined()
  @IsNumberString()
  patient_medical_record_id: number;

  @IsDefined()
  @IsNumber()
  temperature: number;

  @IsDefined()
  @IsString()
  date: string;
}
