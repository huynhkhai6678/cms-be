import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany
} from 'typeorm';
import { Medicine } from './medicine.entity';
import { PurchaseMedicine } from './purchase-medicines.entity';

@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 160 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone?: string;

  @CreateDateColumn({ type: 'timestamp', precision: 0, nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 0, nullable: true })
  updated_at?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contact_person?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  payment_terms?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website?: string;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Column({ type: 'bigint', unsigned: true, default: () => '1' })
  clinic_id: number;

  @ManyToMany(() => Medicine, (medicine) => medicine.brands)
  medicines: Medicine[];

  @OneToMany(() => PurchaseMedicine, (purchase) => purchase.clinic)
  purchases: PurchaseMedicine[];
}