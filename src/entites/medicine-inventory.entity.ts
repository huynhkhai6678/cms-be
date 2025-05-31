import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Medicine } from './medicine.entity';
import { MedicineInventoryUsage } from './medicine-inventory-usage.entity';

@Entity('medicine_inventories')
export class MedicineInventory {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'medicine_id', type: 'bigint', unsigned: true })
  medicine_id: number;

  @ManyToOne(() => Medicine, { nullable: true })
  @JoinColumn({ name: 'medicine_id' })
  medicine: Medicine;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  bonus: number;

  @Column({ type: 'int', default: 0 })
  price: number;

  @Column({ type: 'float', default: 0.0 })
  cost_per_unit: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  batch_number: string;

  @Column({ type: 'smallint' })
  type: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp', nullable: true })
  expiration_date: Date;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @Column({ type: 'int', default: 0 })
  available_quantity: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  uom: string;

  @OneToMany(() => MedicineInventoryUsage, usage => usage.inventory)
  usages: MedicineInventoryUsage[];
}
