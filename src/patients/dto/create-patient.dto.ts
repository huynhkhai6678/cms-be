import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsNumberString,
} from 'class-validator';

export class CreatePatientDto {
  @IsOptional()
  @IsNumberString()
  clinic_id?: number;

  @IsOptional()
  @IsString()
  patient_unique_id?: string;

  @IsOptional()
  @IsString()
  patient_mrn?: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  gender: number;

  @IsNotEmpty()
  dob: string;

  @IsOptional()
  @IsString()
  marital_status?: string;

  @IsNumberString()
  @IsNotEmpty()
  id_type: string;

  @IsNumberString()
  @IsNotEmpty()
  id_number: string;

  @IsString()
  @IsNotEmpty()
  contact: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  nationality: string;

  @IsOptional()
  @IsString()
  race?: string;

  @IsOptional()
  @IsString()
  religion?: string;

  @IsOptional()
  @IsString()
  ethnicity?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  confirm_password: string;

  @IsOptional()
  @IsString()
  address1?: string;

  @IsOptional()
  @IsString()
  address2?: string;

  @IsOptional()
  country_id?: number;

  @IsOptional()
  state_id?: number;

  @IsOptional()
  city_id?: number;

  @IsOptional()
  @IsString()
  postal_code?: string;

  @IsOptional()
  @IsString()
  other_contact?: string;

  @IsOptional()
  @IsString()
  other_region_code?: string;

  @IsOptional()
  @IsString()
  other_address1?: string;

  @IsOptional()
  @IsString()
  other_address2?: string;

  @IsOptional()
  other_country_id?: number;

  @IsOptional()
  @IsString()
  blood_group?: string;

  @IsOptional()
  @IsString()
  G6PD?: string;

  @IsOptional()
  @IsString()
  allergy?: string;

  @IsOptional()
  @IsString()
  food_allergy?: string;

  @IsOptional()
  doctor_id?: number;

  @IsOptional()
  @IsString()
  important_notes?: string;
}
