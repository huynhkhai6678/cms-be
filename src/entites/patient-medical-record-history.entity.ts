import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('patient_medical_record_histories')
export class PatientMedicalRecordHistory {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  patient_medical_record_id: number;

  @Column({ type: 'bigint', unsigned: true })
  created_by: number;

  @Column({ type: 'tinyint', default: 1 })
  type: number;

  @Column({ type: 'text' })
  data: string;

  @ManyToOne(() => User, (user) => user.histories)
  @JoinColumn({ name: 'created_by' })
  user: User;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at?: Date;

  note_data?: JSON;
}
