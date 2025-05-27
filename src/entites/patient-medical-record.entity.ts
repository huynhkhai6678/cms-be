import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from './patient.entity';
import { Clinic } from './clinic.entity';

@Entity('patient_medical_records')
export class PatientMedicalRecord {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  patient_id: number;

  @Column({ type: 'text', nullable: true })
  allergy: string;

  @Column({ type: 'text', nullable: true })
  important_notes: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  notes_updated_at: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  diagnosis: string;

  @Column({ type: 'boolean', default: false })
  changed: boolean;

  @Column({ type: 'bigint', unsigned: true, default: 1 })
  clinic_id: number;

  // Relationships with Patient and Clinic entities (assuming you have those entities)
  @ManyToOne(() => Patient, (patient) => patient.medicalRecords)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @ManyToOne(() => Clinic, (clinic) => clinic.medicalRecords)
  @JoinColumn({ name: 'clinic_id' })
  clinic: Clinic;
}