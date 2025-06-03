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

@Entity('transaction_invoice_receipts') // The table name
export class TransactionInvoiceReceipt {
    @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
    id: number;

    @Column({ type: 'bigint', unsigned: true })
    transaction_invoice_id: number;

    @Column({ type: 'varchar', length: 255 })
    receipt_number: string;

    @Column({ type: 'float', default: 0.00 })
    service_amount: number;

    @Column({ type: 'float', default: 0.00 })
    inventory_amount: number;

    @Column({ type: 'float', default: 0.00 })
    amount: number;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
    created_at?: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
    updated_at?: Date;

    @ManyToOne(() => TransactionInvoice, (invoice) => invoice.receipt)
    @JoinColumn({ name: 'transaction_invoice_id' })
    transaction_invoice: TransactionInvoice;
}