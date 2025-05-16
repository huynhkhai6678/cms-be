import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserClinic } from './user-clinic.entity';
import { Address } from './address.entity';

@Entity('clinics')
export class Clinic {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    phone: string;

    @Column({ name: 'default', type: 'boolean' })
    default: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', precision: 0, nullable: true })
    created_at?: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', precision: 0, nullable: true })
    updated_at?: Date;

    @Column({ type: 'varchar', length: 255 })
    code: string;

    @Column({ name: 'landing_name', type: 'varchar', length: 255 })
    landing_bame: string;

    @Column({ name: 'region_code', type: 'varchar', length: 255 })
    region_code: string;

    @Column({ type: 'varchar', length: 255 })
    email: string;

    @Column({ name: 'social_link', type: 'varchar', length: 255, nullable: true })
    social_link?: string;

    @Column({ name: 'country_id', type: 'bigint', unsigned: true })
    country_id: number;

    @Column({ type: 'tinyint' })
    type: number;

    @Column({ name: 'address_id', type: 'bigint', nullable: true })
    address_id?: number;

    @OneToMany(() => UserClinic, (userClinic) => userClinic.clinic)
    userClinic: UserClinic[];

    @OneToOne(() => Address, (address) => address.clinic, { eager: false })
    @JoinColumn({ name: 'address_id' })
    address: Address;
}