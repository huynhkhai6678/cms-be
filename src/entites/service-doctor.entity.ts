import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { Service } from './service.entity';
import { Doctor } from './doctor.entity';

@Entity({ name: 'service_doctor' })
export class ServiceDoctor {
  @PrimaryColumn({ type: 'bigint', unsigned: true })
  service_id: number;

  @PrimaryColumn({ type: 'bigint', unsigned: true })
  doctor_id: number;

  @ManyToOne(() => Doctor, (doctor) => doctor.serviceDoctors, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'doctor_id' })
  doctors: Doctor;

  @ManyToOne(() => Service, (service) => service.service_doctors, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'service_id' })
  services: Service;
}
