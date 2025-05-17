import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Permission } from './permission.entity';
import { RoleHasPermission } from './role-has-permission.entity';
import { User } from 'src/entites/user.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column()
  name: string;

  @Column({ name: 'display_name', length: 255 })
  display_name: string;

  @Column({ name: 'is_default', type: 'int', default: 0 })
  is_default: number;

  @Column({ name: 'guard_name' })
  guard_name: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updated_at?: Date;

  @Column({ name: 'clinic_id', type: 'bigint', unsigned: true, default: 1 })
  clinic_id: number;

  @OneToMany(() => RoleHasPermission, (rhp) => rhp.role)
  roleHasPermissions: RoleHasPermission[];

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({
    name: 'role_has_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: Permission[];
}
