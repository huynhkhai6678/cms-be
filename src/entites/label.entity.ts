import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('labels')
export class Label {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;  // Use string in TypeScript for BigInt columns

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'int' })
  type: number;

  @CreateDateColumn({ type: 'timestamp', precision: 0, nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 0, nullable: true })
  updated_at?: Date;

  @Column({ type: 'bigint', unsigned: true, default: () => '1' })
  clinic_id: number;
}
