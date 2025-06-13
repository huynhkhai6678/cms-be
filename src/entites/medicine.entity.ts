import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Brand } from './brand.entity';
import { Category } from './category.entity';
import { MedicineInventory } from './medicine-inventory.entity';
import { PurchasedMedicine } from './purchased-medicines.entity';

@Entity('medicines')
export class Medicine {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

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
  first_expiration_date?: Date | null;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ type: 'bigint', unsigned: true, default: () => '1' })
  clinic_id: number;

  @ManyToMany(() => Category, (category) => category.medicines, {
    createForeignKeyConstraints: false,
  })
  @JoinTable({
    name: 'medicines_categories',
    joinColumn: { name: 'medicine_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];

  @ManyToMany(() => Brand, (brand) => brand.medicines, {
    createForeignKeyConstraints: false,
  })
  @JoinTable({
    name: 'medicines_brands',
    joinColumn: { name: 'medicine_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'brand_id', referencedColumnName: 'id' },
  })
  brands: Brand[];

  @OneToMany(() => MedicineInventory, (inventory) => inventory.medicine)
  inventories: MedicineInventory[];

  @OneToMany(() => PurchasedMedicine, (pm) => pm.medicine)
  purchased_medicines: PurchasedMedicine[];

  //   @OneToMany(() => PrescriptionMedicine, (pm) => pm.medicine)
  //   prescriptions_medicines: PrescriptionMedicine[];

  //   @OneToMany(() => UsedMedicine, (um) => um.medicine)
  //   used_medicines: UsedMedicine[];
}
