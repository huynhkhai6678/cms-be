
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Clinic } from './clinic.entity';

@Entity('clinic_chains')
export class ClinicChain {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    precision: 0,
    nullable: true,
  })
  created_at?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    precision: 0,
    nullable: true,
  })
  updated_at?: Date;

  @OneToMany(() => User, (user) => user.clinic_chain)
  users: User[];

  @ManyToMany(() => Clinic, (clinic) => clinic.chains)
  @JoinTable({
    name: 'clinic_chain_groups',
    joinColumn: { name: 'clinic_chain_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'clinic_id', referencedColumnName: 'id' },
  })
  clinics: Clinic[];
}
