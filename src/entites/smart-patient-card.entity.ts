import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { Patient } from './patient.entity';

@Entity('smart_patient_cards')
export class SmartPatientCard {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({type: 'varchar', length: 255 })
  template_name: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({type: 'varchar', length: 255 })
  header_color: string;

  @Column({ type: 'boolean', default: true })
  show_email: boolean;

  @Column({ type: 'boolean', default: true })
  show_phone: boolean;

  @Column({ type: 'boolean', default: true })
  show_dob: boolean;

  @Column({  type: 'boolean', default: true })
  show_blood_group: boolean;

  @Column({  type: 'boolean', default: true })
  show_address: boolean;

  @Column({ type: 'boolean', default: true })
  show_patient_unique_id: boolean;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  @Column({ name: 'clinic_id', type: 'bigint', unsigned: true, default: 1 })
  clinic_id: number;

  // Relations
  @OneToMany(() => Patient, patient => patient.smart_patient_card)
  patients: Patient[];
}