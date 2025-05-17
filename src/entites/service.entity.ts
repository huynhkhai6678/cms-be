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
import { ServiceCategory } from './service-category.entity';
import { ServiceDoctor } from './service-doctor.entity';
import { Appointment } from './appointment.entitty';

@Entity({ name: 'services' })
@Index('services_category_id_foreign', ['category_id'])
export class Service {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @Column({ type: 'bigint', unsigned: true })
  category_id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'float', nullable: true })
  charges?: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @CreateDateColumn({ type: 'timestamp', precision: 0, nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 0, nullable: true })
  updated_at?: Date;

  @Column({ type: 'text' })
  short_description: string;

  @Column({ type: 'bigint', unsigned: true, default: 1 })
  clinic_id: number;

  // Relations
  @OneToMany(() => ServiceDoctor, (serviceDoctor) => serviceDoctor.services)
  service_doctor: ServiceDoctor[];

  @ManyToOne(() => ServiceCategory, (category) => category.services, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  service_categories: ServiceCategory;

  @OneToMany(() => Appointment, (appoiment) => appoiment.service)
  appointments: Appointment[];
}