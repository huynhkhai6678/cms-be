import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Address } from './address.entity';
import { User } from '../entites/user.entity';
import { ClinicChain } from './clinic-chain.entity';
import { Visit } from './visit.entity';
import { TransactionInvoice } from './transaction-invoice.entity';
import { PatientMedicalRecord } from './patient-medical-record.entity';
import { PurchaseMedicine } from './purchase-medicines.entity';

@Entity('clinics')
export class Clinic {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  phone: string;

  @Column({ name: 'default', type: 'boolean' })
  default: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', precision: 0 })
  created_at?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', precision: 0 })
  updated_at?: Date;

  @Column({ type: 'varchar', length: 255 })
  code: string;

  @Column({ name: 'landing_name', type: 'varchar', length: 255 })
  landing_name: string;

  @Column({ name: 'region_code', type: 'varchar', length: 255 })
  region_code: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ name: 'social_link', type: 'varchar', length: 255, nullable: true })
  social_link?: string;

  @Column({ name: 'country_id', type: 'bigint', unsigned: true })
  country_id: number;

  @Column({ type: 'tinyint' })
  type: number;

  address: Address;

  @ManyToMany(() => ClinicChain, (clinicChain) => clinicChain.clinics)
  chains: ClinicChain[];

  @ManyToMany(() => User, (user) => user.clinics)
  users: User[];

  @OneToMany(() => Visit, (visit) => visit.clinic)
  visits: Visit[];

  @OneToMany(() => TransactionInvoice, (tran) => tran.clinic)
  transactions: TransactionInvoice[];

  @OneToMany(() => PatientMedicalRecord, (record) => record.clinic)
  medicalRecords: PatientMedicalRecord[];

  @OneToMany(() => PurchaseMedicine, (purchase) => purchase.clinic)
  purchases: PurchaseMedicine[];
}
