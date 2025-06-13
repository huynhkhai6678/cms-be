import { IsDefined, IsNumber, IsNumberString, IsString } from 'class-validator';

export class CreateVisitDto {
  @IsDefined()
  doctor_id: number;

  @IsDefined()
  patient_id: number;

  @IsDefined()
  @IsString()
  visit_date: string;

  @IsDefined()
  @IsString()
  dob: string;

  @IsDefined()
  @IsNumberString()
  id_number: number;

  @IsDefined()
  @IsNumber()
  id_type: number;

  @IsDefined()
  @IsNumber()
  visit_type: string;

  patient_name: string;
  appointment_id: number;

  @IsDefined()
  phone: {
    e164Number: string;
    dialCode: string;
  };
}
