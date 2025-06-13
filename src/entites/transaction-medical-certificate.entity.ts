import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { TransactionInvoice } from './transaction-invoice.entity';
import { Doctor } from './doctor.entity';

@Entity('transaction_medical_certificates') // Table name in the database
export class TransactionMedicalCertificate {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  transaction_invoice_id: number;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'tinyint', nullable: true })
  type?: number;

  @Column({ type: 'timestamp', nullable: true })
  start_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_date: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  start_time?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  end_time?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updated_at?: Date;

  @Column({ type: 'bigint', unsigned: true })
  doctor_id: number;

  @Column({ type: 'varchar', length: 255 })
  certificate_number: string;

  @OneToOne(() => TransactionInvoice, (invoice) => invoice.medical_certificate)
  @JoinColumn({ name: 'transaction_invoice_id' })
  transaction_invoice: TransactionInvoice;

  // Establish relationship with Doctor
  @ManyToOne(() => Doctor, (doctor) => doctor.medical_certificates)
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;
}
