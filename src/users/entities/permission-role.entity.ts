import { Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { PermissionEntity } from './permission.entity';
import { RoleEntity } from './role.entity';

@Entity({ name: 'permission_rol' })
export class PermissionRoleEntity extends BaseEntity {

  @ManyToOne(() => PermissionEntity)
  permission: PermissionEntity;

  @ManyToOne(() => RoleEntity, role => role.permissions)
  role: RoleEntity;
}