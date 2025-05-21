import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('clinic_schedules')
export class ClinicSchedule {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  day_of_week: string;

  @Column({ type: 'varchar', length: 255 })
  start_time: string;

  @Column({ type: 'varchar', length: 255 })
  end_time: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'bigint', unsigned: true, default: 1 })
  clinic_id: number;

  checked?: boolean;
}