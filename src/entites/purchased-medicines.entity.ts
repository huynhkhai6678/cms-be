import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Medicine } from './medicine.entity';
import { Label } from './label.entity';
import { PurchaseMedicine } from './purchase-medicines.entity';

@Entity('purchased_medicines')
@Index('purchased_medicines_medicine_id_foreign', ['medicine_id'])
@Index('purchased_medicines_purchase_medicines_id_foreign', ['purchase_medicines_id'])
export class PurchasedMedicine {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @Column({ type: 'bigint', unsigned: true })
  purchase_medicines_id: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  medicine_id?: number;

  @Column({ type: 'datetime', nullable: true })
  expiry_date?: Date;

  @Column({ type: 'varchar', length: 255 })
  lot_no: string;

  @Column({ type: 'float' })
  tax: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'float' })
  amount: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at?: Date;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  label_id?: number;

  // Relations

  @ManyToOne(() => PurchaseMedicine, (purchase) => purchase.purchased_medicines, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'purchase_medicines_id' })
  purchase: PurchaseMedicine;

  @ManyToOne(() => Medicine, (medicine) => medicine.purchased_medicines, { nullable: true })
  @JoinColumn({ name: 'medicine_id' })
  medicines?: Medicine;

  @ManyToOne(() => Label, (label) => label.purchased_medicines, { nullable: true })
  @JoinColumn({ name: 'label_id' })
  label?: Label;
}