import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  JoinColumn,
} from 'typeorm';
import { Service } from './service.entity';
import { Doctor } from './doctor.entity';

@Entity({ name: 'service_doctor' })
export class ServiceDoctor {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @Index('service_doctor_service_id_foreign')
  @Column({ type: 'bigint', unsigned: true })
  service_id: string;

  @Index('service_doctor_doctor_id_foreign')
  @Column({ type: 'bigint', unsigned: true })
  doctor_id: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.serviceDoctors, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'doctor_id' })
  doctors: Doctor;

  @ManyToOne(() => Service, (service) => service.service_doctor, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'service_id' })
  services: Service;
}