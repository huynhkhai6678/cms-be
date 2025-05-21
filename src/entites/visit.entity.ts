import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index
} from 'typeorm';
import { Doctor } from './doctor.entity';
import { Patient } from './patient.entity';
import { Clinic } from './clinic.entity';
import { TransactionInvoice } from './tranasction-invoice.entity';

@Entity('visits')
@Index('visits_doctor_id_foreign', ['doctor_id']) // Index on doctor_id
@Index('visits_patient_id_foreign', ['patient_id']) // Index on patient_id
export class Visit {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  visit_date: string;

  @Column({ type: 'varchar', length: 255 })
  visit_type: string;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  doctor_id: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  patient_id: number;

  @ManyToOne(() => Doctor, (doctor) => doctor.visits, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @ManyToOne(() => Patient, (patient) => patient.visits, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int' })
  id_type: number;

  @Column({ type: 'int' })
  id_number: number;

  @Column({ type: 'varchar', length: 255 })
  dob: string;

  @Column({ type: 'int' })
  age: number;

  @Column({ type: 'varchar', length: 255 })
  region_code: string;

  @Column({ type: 'varchar', length: 255 })
  contact_no: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updated_at: Date;

  @Column({ type: 'text', nullable: true })
  important_notes: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  encounter_id: string;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deleted_at: Date;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  appointment_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  checkout_date: string;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  clinic_id: number;

  @ManyToOne(() => Clinic, (clinic) => clinic.visits, { nullable: true })
  @JoinColumn({ name: 'clinic_id' })
  clinic: Clinic;

  @OneToMany(() => TransactionInvoice, (tran) => tran.visit)
  transactions: TransactionInvoice[];

//   // Relations
//   @OneToMany(() => VisitNote, (visitNote) => visitNote.visit)
//   visit_notes: VisitNote[];

//   @OneToMany(() => VisitObservation, (visitObservation) => visitObservation.visit)
//   visit_observations: VisitObservation[];

//   @OneToMany(() => VisitPrescription, (visitPrescription) => visitPrescription.visit)
//   visit_prescriptions: VisitPrescription[];

//   @OneToMany(() => VisitProblem, (visitProblem) => visitProblem.visit)
//   visit_problems: VisitProblem[];
}