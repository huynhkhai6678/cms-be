import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Doctor } from './doctor.entity';
import { Service } from './service.entity';
import { Patient } from './patient.entity';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @Index('appointments_doctor_id_foreign')
  @Column({ type: 'bigint', unsigned: true })
  doctor_id: string;

  @Index('appointments_patient_id_foreign')
  @Column({ type: 'int', unsigned: true, nullable: true })
  patient_id: number;

  @Column({ type: 'varchar', length: 255 })
  date: string;

  @Column({ type: 'varchar', length: 255 })
  from_time: string;

  @Column({ type: 'varchar', length: 255 })
  from_time_type: string;

  @Column({ type: 'varchar', length: 255 })
  to_time: string;

  @Column({ type: 'varchar', length: 255 })
  to_time_type: string;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Index('appointments_service_id_foreign')
  @Column({ type: 'bigint', unsigned: true })
  service_id: string;

  @Column({ type: 'varchar', length: 255 })
  region_code: string;

  @Column({ type: 'varchar', length: 255 })
  contact: string;

  @Column({ type: 'varchar', length: 255 })
  id_type: string;

  @Column({ type: 'varchar', length: 255 })
  id_number: string;

  @Column({ type: 'varchar', length: 255 })
  dob: string;

  @Column({ type: 'varchar', length: 255 })
  age: string;

  @Column({ type: 'varchar', length: 255 })
  payable_amount: string;

  @Column({ type: 'int', default: 1 })
  payment_type: number;

  @Column({ type: 'int', default: 1 })
  payment_method: number;

  @Column({ type: 'varchar', length: 255 })
  appointment_unique_id: string;

  @CreateDateColumn({ type: 'timestamp', precision: 0 })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 0 })
  updated_at: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  patient_name: string;

  @Column({ type: 'bigint', unsigned: true, default: 1 })
  clinic_id: string;

  //
  // RELATIONS
  //

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @ManyToOne(() => Service, (service) => service.appointments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @ManyToOne(() => Patient, (patient) => patient.appointments, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;
}
