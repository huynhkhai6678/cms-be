import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Doctor } from './doctor.entity';  // Assuming the Doctor entity is defined in a file called 'doctor.entity.ts'

@Entity('doctor_holidays')  // The table name
export class DoctorHoliday {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;  // Use string for BigInt

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'bigint', unsigned: true })
  doctor_id: number;

  @Column({ type: 'varchar', length: 255 })
  date: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'bigint', unsigned: true, default: 1 })
  clinic_id: number;

  // Define the many-to-one relation with Doctor
  @ManyToOne(() => Doctor, doctor => doctor.holidays, { onDelete: 'CASCADE', createForeignKeyConstraints: false })
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;
}