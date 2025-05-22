import { IsArray, IsDefined } from 'class-validator';
import { ClinicSchedule } from '../../entites/clinic-schedule.entity';

export class UpdateClinicScheduleDto {
  @IsArray()
  @IsDefined()
  schedule: ClinicSchedule[];
}
