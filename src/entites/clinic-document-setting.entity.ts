import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('clinic_document_setting')
export class ClinicDocumentSetting {
  
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column('text')
  header: string;

  @CreateDateColumn({ type: 'timestamp', precision: 0, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 0, default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column('text')
  transaction_receipt_template: string;

  @Column('text')
  medical_certificate_template: string;

  @Column('text')
  transaction_invoice_template: string;

  @Column('bigint', { default: 1, unsigned: true })
  clinic_id: number;
}