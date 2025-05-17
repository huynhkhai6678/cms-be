import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Doctor } from './doctor.entity';
import { Specialization } from './specilization.entity';

@Entity('doctor_specialization')
@Index('doctor_specialization_doctor_id_foreign', ['doctor_id'])
@Index('doctor_specialization_specialization_id_foreign', ['specialization_id'])
export class DoctorSpecialization {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @Column({ type: 'bigint', unsigned: true })
  doctor_id: string;

  @Column({ type: 'bigint', unsigned: true })
  specialization_id: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @ManyToOne(() => Doctor, (doctor) => doctor.doctorSpecializations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @ManyToOne(() => Specialization, (specialization) => specialization.doctorSpecializations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'specialization_id' })
  specialization: Specialization;
}