import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { DoctorSpecialization } from './doctor-specilization.entity';
import { Doctor } from './doctor.entity';

@Entity({ name: 'specializations' })
export class Specialization {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @CreateDateColumn({
    type: 'timestamp',
    precision: 0,
    nullable: true,
    name: 'created_at',
  })
  created_at?: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    precision: 0,
    nullable: true,
    name: 'updated_at',
  })
  updated_at?: Date;

  @Column({ type: 'bigint', unsigned: true, default: 1 })
  clinic_id: number;

  @OneToMany(() => DoctorSpecialization, (ds) => ds.doctor)
  doctorSpecializations: DoctorSpecialization[];

  @ManyToMany(() => Doctor, (doctor) => doctor.specializations)
  doctors: Doctor[];
}
