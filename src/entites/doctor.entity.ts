import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { ServiceDoctor } from './service-doctor.entity';
import { DoctorSpecialization } from './doctor-specilization.entity';
import { Appointment } from './appointment.entitty';
import { User } from './user.entity';
import { Visit } from './visit.entity';
import { TransactionInvoice } from './transaction-invoice.entity';
import { SessionWeekDay } from './session-week-days.entity';
import { DoctorSession } from './doctor-session.entity';
import { Service } from './service.entity';
import { Review } from './review.entity';
import { Specialization } from './specilization.entity';
import { DoctorHoliday } from './doctor-holiday.entity';
import { TransactionMedicalCertificate } from './transaction-medical-certificate.entity';

@Entity('doctors')
@Index('doctors_user_id_foreign', ['user_id'])
export class Doctor {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'user_id', type: 'bigint', unsigned: true, unique: true })
  user_id: number;

  @Column({ type: 'float', nullable: true })
  experience?: number;

  @Column({ name: 'twitter_url', type: 'varchar', length: 255, nullable: true })
  twitter_url?: string;

  @Column({
    name: 'linkedin_url',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  linkedin_url?: string;

  @Column({
    name: 'instagram_url',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  instagram_url?: string;

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

  // Relationships
  @OneToOne(() => User, (user) => user.doctor)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => ServiceDoctor, (serviceDoctor) => serviceDoctor.doctors)
  serviceDoctors: ServiceDoctor[];

  @OneToMany(() => DoctorSpecialization, (ds) => ds.doctor)
  doctorSpecializations: DoctorSpecialization[];

  @OneToMany(() => Appointment, (appoiment) => appoiment.doctor)
  appointments: Appointment[];

  @OneToMany(() => Visit, (visit) => visit.doctor)
  visits: Visit[];

  @OneToMany(() => TransactionInvoice, (tran) => tran.doctor)
  transactions: TransactionInvoice[];

  @OneToMany(() => SessionWeekDay, (sessionWeekDay) => sessionWeekDay.doctor)
  sessionWeekDays: SessionWeekDay[];

  @OneToMany(() => DoctorSession, (doctorSession) => doctorSession.doctor)
  doctorSessions: DoctorSession[];

  @ManyToMany(() => Service, (service) => service.doctors)
  services: Service[];

  @OneToMany(() => Review, (review) => review.doctor)
  reviews: Review[];

  @OneToMany(() => DoctorHoliday, (holiday) => holiday.doctor)
  holidays: DoctorHoliday[];

  @ManyToMany(() => Specialization, (specialization) => specialization.doctors)
  @JoinTable({
    name: 'doctor_specialization',
    joinColumn: { name: 'doctor_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'specialization_id',
      referencedColumnName: 'id',
    },
  })
  specializations: Specialization[];

  @OneToMany(
    () => TransactionMedicalCertificate,
    (certificate) => certificate.doctor,
  )
  medical_certificates: TransactionMedicalCertificate[];
}
