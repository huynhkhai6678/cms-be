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
import { Doctor } from './doctor.entity'; // Import the Doctor entity
import { Patient } from './patient.entity'; // Import the Patient entity

@Entity('reviews')
@Index('reviews_doctor_id_foreign', ['doctor_id']) // Create index on doctor_id
@Index('reviews_patient_id_foreign', ['patient_id']) // Create index on patient_id
export class Review {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  patient_id: number;

  @Column({ type: 'bigint', unsigned: true })
  doctor_id: number;

  @Column({ type: 'varchar', length: 255 })
  review: string;

  @Column({ type: 'int' })
  rating: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  // Define relationships
  @ManyToOne(() => Doctor, (doctor) => doctor.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @ManyToOne(() => Patient, (patient) => patient.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;
}
