import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Clinic } from './clinic.entity';
import { State } from './state.entity';
import { City } from './city.entity';
import { Country } from './country.entity';

@Entity('addresses')
@Index('addresses_city_id_foreign', ['city_id'])
@Index('addresses_country_id_foreign', ['country_id'])
@Index('addresses_state_id_foreign', ['state_id'])
export class Address {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'owner_id', type: 'bigint', nullable: true })
  owner_id?: number;

  @Column({ name: 'owner_type', type: 'varchar', length: 255, nullable: true })
  owner_type?: string;

  @Column({ name: 'address1', type: 'varchar', length: 255, nullable: true })
  address1?: string;

  @Column({ name: 'address2', type: 'varchar', length: 255, nullable: true })
  address2?: string;

  @Column({ name: 'country_id', type: 'bigint', unsigned: true, nullable: true })
  country_id?: number;

  @Column({ name: 'state_id', type: 'bigint', unsigned: true, nullable: true })
  state_id?: number;

  @Column({ name: 'city_id', type: 'bigint', unsigned: true, nullable: true })
  city_id?: number;

  @Column({ name: 'postal_code', type: 'varchar', length: 255, nullable: true })
  postal_code?: string;

  @Column({ name: 'other_region_code', type: 'varchar', length: 255 })
  other_region_code: string;

  @Column({ name: 'other_contact', type: 'varchar', length: 255 })
  other_contact: string;

  @Column({ name: 'other_address1', type: 'varchar', length: 255 })
  other_address1: string;

  @Column({ name: 'other_address2', type: 'varchar', length: 255 })
  other_address2: string;

  @Column({ name: 'other_country_id', type: 'varchar', length: 255 })
  other_country_id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', precision: 0, nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', precision: 0, nullable: true })
  updated_at?: Date;

  @OneToOne(() => Clinic, (clinic) => clinic.address)
  clinic: Clinic;

  @ManyToOne(() => State, (state) => state.addresses)
  @JoinColumn({ name: 'state_id' })
  state: State;

  @ManyToOne(() => Country, (country) => country.addresses)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @ManyToOne(() => City, (city) => city.addresses)
  @JoinColumn({ name: 'city_id' })
  city: City;
}