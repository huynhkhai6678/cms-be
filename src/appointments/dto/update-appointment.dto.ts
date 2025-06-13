import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from './create-appointment.dto';
import { IsDefined, IsString } from 'class-validator';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  status: number;

  @IsDefined()
  doctor_id: number;

  @IsDefined()
  patient_id: number;

  @IsDefined()
  date: string;

  @IsDefined()
  @IsString()
  from_time_value: string;

  @IsDefined()
  @IsString()
  to_time_value: string;

  @IsDefined()
  @IsString()
  dob: string;

  @IsDefined()
  @IsString()
  id_number: string;

  @IsDefined()
  id_type: string;

  patient_name: string;
}
