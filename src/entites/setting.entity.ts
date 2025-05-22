import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'settings' })
export class Setting {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  key: string;

  @Column({ type: 'text' })
  value: string;

  @CreateDateColumn({
    type: 'timestamp',
    precision: 0,
    nullable: true,
    name: 'created_at',
  })
  created_at?: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    precision: 0,
    nullable: true,
    name: 'updated_at',
  })
  updated_at?: Date;

  @Column({ type: 'bigint', unsigned: true, default: 1 })
  clinic_id: number;
}
