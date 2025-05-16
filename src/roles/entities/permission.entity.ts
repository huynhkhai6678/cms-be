import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToMany, OneToMany
} from 'typeorm';
import { Role } from './role.entity';
import { RoleHasPermission } from './role-has-permission.entity';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'name', length: 191 })
  name: string;

  @Column({ name: 'display_name', length: 191 })
  display_name: string;

  @Column({ name: 'guard_name' })
  guard_name: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updated_at?: Date;

  @OneToMany(() => RoleHasPermission, rhp => rhp.permission)
  roleHasPermissions: RoleHasPermission[];

  @ManyToMany(() => Role, role => role.permissions)
  roles: Role[];
}