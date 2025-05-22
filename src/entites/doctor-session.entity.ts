import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Doctor } from './doctor.entity'; // Adjust the import path as needed
import { SessionWeekDay } from './session-week-days.entity';

@Entity('doctor_sessions')
@Index('doctor_sessions_doctor_id_foreign', ['doctor_id'])
export class DoctorSession {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  doctor_id: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.doctorSessions)
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @Column({ type: 'bigint' })
  session_meeting_time: string;

  @Column({ type: 'varchar', length: 255, default: '0' })
  session_gap: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @Column({ type: 'bigint', unsigned: true, default: 1 })
  clinic_id: number;

  @OneToMany(
    () => SessionWeekDay,
    (sessionWeekDay) => sessionWeekDay.doctorSession,
  )
  sessionWeekDays: SessionWeekDay[];
}
