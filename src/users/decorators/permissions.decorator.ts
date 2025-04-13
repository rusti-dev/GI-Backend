import { SetMetadata } from '@nestjs/common';
import {
  PERMISSION,
  PERMISSION_KEY,
} from '../../users/constants/permission.constant';

export const PermissionAccess = (...roles: Array<PERMISSION>) =>
  SetMetadata(PERMISSION_KEY, roles);
