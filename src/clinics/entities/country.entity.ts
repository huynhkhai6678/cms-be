import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { State } from './state.entity';
import { Address } from './address.entity';

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'short_code', type: 'varchar', length: 255, nullable: true })
  short_code?: string;

  @Column({ name: 'phone_code', type: 'varchar', length: 255, nullable: true })
  phone_code?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', precision: 0, nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', precision: 0, nullable: true })
  updated_at?: Date;

  @OneToMany(() => State, (state) => state.country)
  states: State[];

  @OneToMany(() => Address, (address) => address.country)
  addresses: Address[];
}