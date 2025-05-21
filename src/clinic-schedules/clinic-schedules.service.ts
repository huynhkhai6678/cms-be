import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateClinicScheduleDto } from './dto/update-clinic-schedule.dto';
import { ClinicSchedule } from '../entites/clinic-schedule.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionWeekDay } from 'src/entites/session-week-days.entity';

@Injectable()
export class ClinicSchedulesService {
  constructor(
    @InjectRepository(ClinicSchedule)
    private readonly clinicScheduleRepo: Repository<ClinicSchedule>,
    @InjectRepository(SessionWeekDay)
    private readonly weekDayRepo: Repository<SessionWeekDay>,
  ) {}

  async findOne(clinic_id: number) {
    const schedules = await this.clinicScheduleRepo.findBy( { clinic_id });
    return {
      data : schedules
    };
  }

  async update(clinic_id: number, updateClinicScheduleDto: UpdateClinicScheduleDto) {
    const schedules = updateClinicScheduleDto.schedule;
    for (const scheduleDto of schedules) {      
      if (scheduleDto.checked) {
        const schedule = await this.clinicScheduleRepo.findOne({
          where: {
            clinic_id,
            day_of_week: scheduleDto.day_of_week
          }
        });

        if (schedule) {
          // Update existing schedule
          schedule.start_time = scheduleDto.start_time;
          schedule.end_time = scheduleDto.end_time;
          await this.clinicScheduleRepo.save(schedule);
        } else {
          // Create new schedule
          const scheduleNew = this.clinicScheduleRepo.create(scheduleDto);
          scheduleNew.clinic_id = clinic_id;
          await this.clinicScheduleRepo.save(scheduleNew);
        }
      } else {
        const schedule = await this.clinicScheduleRepo.findOne({
          where: {
            clinic_id,
            day_of_week: scheduleDto.day_of_week
          }
        });
        
        if (schedule) {
          // Delete 
          const sessions = await this.weekDayRepo.find({
            where: {
              clinic_id,
              day_of_week : schedule.day_of_week
            }
          })

          await this.weekDayRepo.remove(sessions);
          await this.clinicScheduleRepo.remove(schedule);
        }
      }
    }
    return true;
  }

  async checkRecord(clinic_id: number, updateClinicScheduleDto: UpdateClinicScheduleDto) {
    const schedules = updateClinicScheduleDto.schedule;
    for (const scheduleDto of schedules) {
      if (!scheduleDto.checked) {
        const sessions = await this.weekDayRepo.find({
          where: {
            clinic_id,
            day_of_week : scheduleDto.day_of_week
          }
        })

        if (sessions.length > 0) {
          throw new BadRequestException(`Confirm remove`);
        }
      }
    }
    return {
      success : true
    }
  }
}
