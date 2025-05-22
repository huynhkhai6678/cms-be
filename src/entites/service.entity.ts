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
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { ServiceCategory } from './service-category.entity';
import { ServiceDoctor } from './service-doctor.entity';
import { Appointment } from './appointment.entitty';
import { Doctor } from './doctor.entity';

@Entity({ name: 'services' })
@Index('services_category_id_foreign', ['category_id'])
export class Service {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  category_id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  charges?: number;

  @Column({ type: 'boolean', default: true })
  status: number;

  @CreateDateColumn({ type: 'timestamp', precision: 0, nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 0, nullable: true })
  updated_at?: Date;

  @Column({ type: 'text' })
  short_description: string;

  @Column({ type: 'bigint', unsigned: true, default: 1 })
  clinic_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image_url?: string;

  // Relations
  @OneToMany(() => ServiceDoctor, (serviceDoctor) => serviceDoctor.services)
  service_doctors: ServiceDoctor[];

  @ManyToOne(() => ServiceCategory, (category) => category.services, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: ServiceCategory;

  @OneToMany(() => Appointment, (appoiment) => appoiment.service)
  appointments: Appointment[];

  @ManyToMany(() => Doctor, (doctor) => doctor.services)
  @JoinTable({
    name: 'service_doctor',
    joinColumn: { name: 'service_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'doctor_id', referencedColumnName: 'id' },
  })
  doctors: Doctor[];
}
