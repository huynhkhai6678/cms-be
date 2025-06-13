import { IsDefined, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsDefined()
  doctor_id: number;

  @IsDefined()
  patient_id: number;

  @IsDefined()
  @IsString()
  date: string;

  @IsDefined()
  @IsString()
  from_time_value: string;

  @IsDefined()
  @IsString()
  to_time_value: string;

  @IsDefined()
  service_id: number;

  @IsDefined()
  @IsString()
  dob: string;

  @IsDefined()
  @IsString()
  id_number: string;

  @IsDefined()
  id_type: string;

  status: number;

  from_time: string;
  from_time_type: string;
  to_time: string;
  to_time_type: string;

  payment_method: number;
  patient_name: string;

  @IsDefined()
  phone: {
    e164Number: string;
    dialCode: string;
  };
}
