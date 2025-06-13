import { PartialType } from '@nestjs/mapped-types';
import { CreateDoctorHolidayDto } from './create-doctor-holiday.dto';

export class UpdateDoctorHolidayDto extends PartialType(
  CreateDoctorHolidayDto,
) {}
