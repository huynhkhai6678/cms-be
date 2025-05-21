import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Doctor } from './doctor.entity'; // Adjust the import path as needed
import { DoctorSession } from './doctor-session.entity';

@Entity('session_week_days')
@Index('session_week_days_doctor_id_foreign', ['doctor_id'])
@Index('session_week_days_doctor_session_id_foreign', ['doctor_session_id'])
export class SessionWeekDay {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  doctor_id: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.sessionWeekDays, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @Column({ type: 'bigint', unsigned: true })
  doctor_session_id: string;

  @ManyToOne(() => DoctorSession, (doctorSession) => doctorSession.sessionWeekDays, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctor_session_id' })
  doctorSession: DoctorSession;

  @Column({ type: 'varchar', length: 255 })
  day_of_week: string;

  @Column({ type: 'varchar', length: 255 })
  start_time: string;

  @Column({ type: 'varchar', length: 255 })
  end_time: string;

  @Column({ type: 'varchar', length: 255 })
  start_time_type: string;

  @Column({ type: 'varchar', length: 255 })
  end_time_type: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'bigint', unsigned: true, default: 1 })
  clinic_id: number;
}