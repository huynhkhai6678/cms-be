import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Brand } from './brand.entity';
import { Clinic } from './clinic.entity';
import { PurchasedMedicine } from './purchased-medicines.entity';

@Entity('purchase_medicines')
export class PurchaseMedicine {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  purchase_no: string;

  @Column({ type: 'float' })
  tax: number;

  @Column({ type: 'float' })
  total: number;

  @Column({ type: 'float' })
  net_amount: number;

  @Column({ type: 'int' })
  payment_type: number;

  @Column({ type: 'float' })
  discount: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  note?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  payment_note?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at?: Date;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  brand_id?: string;

  @Column({ type: 'float' })
  shipping_fee: number;

  @Column({ type: 'bigint', unsigned: true, default: 1 })
  clinic_id: number;

  // Relations

  @OneToMany(() => PurchasedMedicine, (pm) => pm.purchase)
  purchased_medicines: PurchasedMedicine[];

  @ManyToOne(() => Brand, (brand) => brand.purchases, { nullable: true })
  @JoinColumn({ name: 'brand_id' })
  brand?: Brand;

  @ManyToOne(() => Clinic, (clinic) => clinic.purchases)
  @JoinColumn({ name: 'clinic_id' })
  clinic: Clinic;
}
