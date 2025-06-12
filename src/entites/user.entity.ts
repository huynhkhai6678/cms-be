import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Doctor } from './doctor.entity';
import { Patient } from './patient.entity';
import { Role } from './role.entity';
import { ClinicChain } from './clinic-chain.entity';
import { Clinic } from './clinic.entity';
import { Address } from './address.entity';
import { UserClinic } from './user-clinic.entity';
import { PatientMedicalRecordHistory } from './patient-medical-record-history.entity';
import { Exclude, Expose } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'first_name', type: 'varchar', length: 255 })
  first_name: string;

  @Column({ name: 'last_name', type: 'varchar', length: 255 })
  last_name: string;

  @Column({ name: 'email', type: 'varchar', length: 191 })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contact?: string;

  @Column({ type: 'varchar', length: 255 })
  dob: string;

  @Column({ type: 'int', nullable: true })
  gender?: number;

  @Column({ type: 'boolean', default: true })
  status: number;

  @Column({ type: 'varchar', length: 255, default: 'en', nullable: true })
  language?: string;

  @Column({
    name: 'email_verified_at',
    type: 'timestamp',
    precision: 0,
    nullable: true,
  })
  email_verified_at?: Date;

  @Column({ type: 'varchar', length: 255 })
  @Exclude()
  password: string;

  @Column({ type: 'int', nullable: true })
  type?: number;

  @Column({ name: 'blood_group', type: 'varchar', length: 255, nullable: true })
  blood_group?: string;

  @Column({ name: 'G6PD', type: 'varchar', length: 255, nullable: true })
  G6PD?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  allergy?: string;

  @Column({
    name: 'food_allergy',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  food_allergy?: string;

  @Column({ name: 'region_code', type: 'varchar', length: 255, nullable: true })
  region_code?: string;

  @Column({
    name: 'marital_status',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  marital_status?: string;

  @Column({ type: 'varchar', length: 255 })
  race: string;

  @Column({ type: 'varchar', length: 255 })
  ethnicity: string;

  @Column({ name: 'id_type', type: 'varchar', length: 255 })
  id_type: string;

  @Column({ name: 'id_number', type: 'varchar', length: 255 })
  id_number: string;

  @Column({ type: 'varchar', length: 255 })
  nationality: string;

  @Column({ type: 'varchar', length: 255 })
  religion: string;

  @Column({
    name: 'remember_token',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  remember_token?: string;

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

  @Column({ name: 'email_notification', type: 'boolean', default: true })
  email_notification: boolean;

  @Column({ name: 'time_zone', type: 'varchar', length: 255, nullable: true })
  time_zone?: string;

  @Column({ name: 'dark_mode', type: 'boolean', default: false })
  dark_mode: boolean;

  @Column({ name: 'important_notes', type: 'text', nullable: true })
  important_notes?: string;

  @Column({ name: 'clinic_id', type: 'bigint', unsigned: true, default: 1 })
  clinic_id: number;

  @Column({ name: 'show_all_data', type: 'boolean' })
  show_all_data: boolean;

  @Column({
    name: 'clinic_chain_id',
    type: 'bigint',
    unsigned: true,
    nullable: true,
  })
  clinic_chain_id?: number;

  // Relations
  @ManyToOne(() => ClinicChain, (clinicChain) => clinicChain.users)
  @JoinColumn({ name: 'clinic_chain_id' })
  clinic_chain: ClinicChain;

  @OneToMany(() => Doctor, (doctor) => doctor.user, { eager: false })
  doctor: Doctor;

  @OneToMany(() => Patient, (patient) => patient.user, { eager: false })
  patient: Patient;

  @ManyToOne(() => Clinic, (clinic) => clinic.user, { 
    createForeignKeyConstraints: false,
    eager: false
   })
  @JoinColumn({ name: 'clinic_id' })
  clinic: Clinic;

  @OneToOne(() => Role, (role) => role.users, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'type', referencedColumnName: 'id' })
  role: Role;

  @ManyToMany(() => Clinic, (clinic) => clinic.users)
  @JoinTable({
    name: 'user_clinics',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'clinic_id', referencedColumnName: 'id' },
  })
  clinics: Clinic[];

  @OneToMany(() => UserClinic, (userClinic) => userClinic.user)
  user_clinics: UserClinic[];

  @OneToMany(() => PatientMedicalRecordHistory, (history) => history.user)
  histories: PatientMedicalRecordHistory[];

  @Column({ type: 'varchar', length: 255 })
  image_url: string;

  @Expose()
  get fullName(): string {
    return `${this.first_name} ${this.last_name}`;
  }

  address?: Address;
}
