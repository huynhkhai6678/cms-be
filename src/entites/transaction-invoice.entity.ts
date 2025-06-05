import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Doctor } from './doctor.entity';
import { Visit } from './visit.entity';
import { Clinic } from './clinic.entity';
import { Patient } from './patient.entity';
import { TransactionMedicalCertificate } from './transaction-medical-certificate.entity';
import { TransactionInvoiceService } from './transaction-invoice-service.entity';
import { TransactionInvoiceReceipt } from './transaction-invoice-receipt.entity';

@Entity('transaction_invoices') // Name of the table
export class TransactionInvoice {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'user_id', type: 'bigint', unsigned: true })
  user_id: number;

  @Column({ name: 'doctor_id', type: 'bigint', unsigned: true })
  doctor_id: number;

  @ManyToOne(() => Doctor, (doctor) => doctor.transactions, { nullable: true })
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @ManyToOne(() => Patient, (user) => user.transactions, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  patient: Patient;

  @Column({ type: 'varchar', length: 255 })
  invoice_number: string;

  @Column({ type: 'text', nullable: true })
  important_notes: string;

  @Column({ type: 'float' })
  tax: number;

  @Column({ type: 'float' })
  total: number;

  @Column({ type: 'float' })
  net_amount: number;

  @Column({ type: 'float' })
  discount: number;

  @Column({ type: 'int', nullable: true })
  payment_type: number;

  @Column({ type: 'int', default: 0 })
  status: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  note: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  payment_note: string;

  @CreateDateColumn({
    name: 'bill_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  bill_date: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updated_at: Date;

  @Column({ name: 'visit_id', type: 'bigint', unsigned: true, nullable: true })
  visit_id: number;

  @Column({ name: 'clinic_id', type: 'bigint', unsigned: true })
  clinic_id: number;

  @ManyToOne(() => Visit, (visit) => visit.transactions, { nullable: true })
  @JoinColumn({ name: 'visit_id' })
  visit: Visit;

  @ManyToOne(() => Clinic, (clinic) => clinic.transactions)
  @JoinColumn({ name: 'clinic_id' })
  clinic: Clinic;

  @OneToOne(() => TransactionMedicalCertificate, (certificate) => certificate.transaction_invoice)
  medical_certificate: TransactionMedicalCertificate;

  @OneToMany(() => TransactionInvoiceService, (service) => service.transaction_invoice)
  services: TransactionInvoiceService[];

  @OneToMany(() => TransactionInvoiceReceipt, (receipt) => receipt.transaction_invoice)
  receipt: TransactionInvoiceReceipt[];
}
