import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TransactionInvoice } from './transaction-invoice.entity';

@Entity('transaction_invoice_services') // The table name
export class TransactionInvoiceService {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  transaction_invoice_id: number;

  @Column({ type: 'bigint', unsigned: true })
  service_id: number;

  @Column({ type: 'varchar', length: 255 })
  type: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'float' })
  quantity: number;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'float' })
  discount: number;

  @Column({ type: 'float' })
  sub_total: number;

  @Column({ type: 'varchar', length: 255 })
  uom: string; // Unit of Measure (UOM)

  @Column({ type: 'varchar', length: 255 })
  dosage: string;

  @Column({ type: 'varchar', length: 255 })
  frequency: string;

  @Column({ type: 'varchar', length: 255 })
  administration: string;

  @Column({ type: 'varchar', length: 255 })
  purpose: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updated_at?: Date;

  @ManyToOne(() => TransactionInvoice, (invoice) => invoice.services)
  @JoinColumn({ name: 'transaction_invoice_id' })
  transaction_invoice: TransactionInvoice;
}
