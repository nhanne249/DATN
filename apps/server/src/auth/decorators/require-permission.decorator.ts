import { SetMetadata } from '@nestjs/common';

export interface RequirePermissionMeta {
  resource: string;
  action: string;
}

export const REQUIRE_PERMISSION_KEY = 'require_permission';

export const RequirePermission = (resource: string, action: string) =>
  SetMetadata(REQUIRE_PERMISSION_KEY, { resource, action } as RequirePermissionMeta);
