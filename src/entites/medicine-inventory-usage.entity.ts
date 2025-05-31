import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { MedicineInventory } from './medicine-inventory.entity';

@Entity('medicine_inventory_usages')
export class MedicineInventoryUsage {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'medicine_inventory_id', type: 'bigint', unsigned: true })
  medicine_inventory_id: number;

  @ManyToOne(() => MedicineInventory, { nullable: true })
  @JoinColumn({ name: 'medicine_inventory_id' })
  inventory: MedicineInventory;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'smallint' })
  type: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  transaction_invoice_id: string;
}
