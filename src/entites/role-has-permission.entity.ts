import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from './role.entity';
import { Permission } from './permission.entity';

@Entity('role_has_permissions')
export class RoleHasPermission {
  @PrimaryColumn({ name: 'permission_id', type: 'bigint', unsigned: true })
  permission_id: number;

  @PrimaryColumn({ name: 'role_id', type: 'bigint', unsigned: true })
  role_id: number;

  @ManyToOne(() => Permission, (permission) => permission.roleHasPermissions, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;

  @ManyToOne(() => Role, (role) => role.roleHasPermissions)
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
