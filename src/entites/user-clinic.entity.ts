import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Clinic } from './clinic.entity'; // Adjust path as needed
import { User } from './user.entity';

@Entity('user_clinics')
export class UserClinic {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'user_id', type: 'bigint', unsigned: true })
  user_id: number;

  @Column({ name: 'clinic_id', type: 'bigint', unsigned: true })
  clinic_id: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    precision: 0,
    nullable: true,
  })
  created_at?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    precision: 0,
    nullable: true,
  })
  updated_at?: Date;

  @ManyToOne(() => User, (user) => user.clinics)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Clinic, (clinic) => clinic.users)
  @JoinColumn({ name: 'clinic_id' })
  clinic: Clinic;
}
