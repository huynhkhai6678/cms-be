import { Module } from '@nestjs/common';
import { FrontService } from './front.service';
import { FrontController } from './front.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting } from '../entites/setting.entity';
import { User } from '../entites/user.entity';
import { Service } from '../entites/service.entity';
import { Doctor } from '../entites/doctor.entity';
import { Specialization } from '../entites/specilization.entity';
import { Appointment } from '../entites/appointment.entitty';
import { FrontPatientTestimonial } from '../entites/front-patient-testimonial.entity';
import { Slider } from '../entites/slider.entity';
import { Clinic } from '../entites/clinic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Setting, Clinic, Specialization, User, Service, Doctor, Appointment, FrontPatientTestimonial, Slider])],
  controllers: [FrontController],
  providers: [FrontService],
})
export class FrontModule {}
