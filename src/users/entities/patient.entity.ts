import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('patients')
@Index('patients_template_id_foreign', ['template_id'])
@Index('patients_user_id_foreign', ['user_id'])
export class Patient {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'patient_unique_id', unique: true })
  patient_unique_id: string;

  @Column({ name: 'patient_mrn', type: 'varchar', length: 255 })
  patient_mrn: string;

  @Column({ name: 'user_id', type: 'bigint', unsigned: true, unique: true })
  user_id: number;

  @Column({ name: 'template_id', type: 'bigint', unsigned: true, nullable: true })
  template_id?: number;

  @Column({ name: 'qr_code', type: 'varchar', length: 255, nullable: true })
  qr_code?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', precision: 0, nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', precision: 0, nullable: true })
  updated_at?: Date;

  // Relationships
  @OneToOne(() => User, (user) => user.patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

}