import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Brand } from './brand.entity';
import { Category } from './category.entity';

@Entity('medicines')
@Index('medicines_brand_id_foreign', ['brand_id'])
@Index('medicines_category_id_foreign', ['category_id'])
export class Medicine {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  category_id?: number;

  @Column({ type: 'longtext', nullable: true })
  category_ids?: string;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  brand_id?: number;

  @Column({ type: 'longtext', nullable: true })
  brand_ids?: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'float', nullable: true })
  selling_price?: number;

  @Column({ type: 'float', nullable: true })
  buying_price?: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int' })
  available_quantity: number;

  @Column({ type: 'text', nullable: true })
  salt_composition?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  side_effects?: string;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Column({ type: 'varchar', length: 255 })
  type: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  code?: string;

  @Column({ type: 'varchar', length: 255 })
  default_dispense: string;

  @Column({ type: 'varchar', length: 255 })
  uom: string;

  @Column({ type: 'varchar', length: 255 })
  dosage: string;

  @Column({ type: 'varchar', length: 255 })
  frequency: string;

  @Column({ type: 'varchar', length: 255 })
  purpose: string;

  @Column({ type: 'varchar', length: 255 })
  administration: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  packing?: string;

  @Column({ type: 'varchar', length: 255 })
  inventory_image: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  currency_symbol?: string;

  @CreateDateColumn({ type: 'timestamp', precision: 0, nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 0, nullable: true })
  updated_at?: Date;

  @Column({ type: 'smallint', nullable: true })
  low_stock_level?: number;

  @Column({ type: 'smallint', nullable: true })
  reorder_level?: number;

  @Column({ type: 'smallint', nullable: true })
  expiration_warning?: number;

  @Column({ type: 'timestamp', precision: 0, nullable: true })
  first_expiration_date?: Date;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ type: 'bigint', unsigned: true, default: () => '1' })
  clinic_id: number;

  @ManyToOne(() => Brand, (brand) => brand.medicines, { nullable: true })
  @JoinColumn({ name: 'brand_id' })
  brands?: Brand;

  @ManyToOne(() => Category, (category) => category.medicines, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  categories?: Category;

//   @OneToMany(() => PrescriptionMedicine, (pm) => pm.medicine)
//   prescriptions_medicines: PrescriptionMedicine[];

//   @OneToMany(() => PurchasedMedicine, (pm) => pm.medicine)
//   purchased_medicines: PurchasedMedicine[];

//   @OneToMany(() => UsedMedicine, (um) => um.medicine)
//   used_medicines: UsedMedicine[];
}
