import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyCustomRole } from './entities/property-custom-role.entity';
import { User } from '../user/entities/user.entity';
import { AuthRole } from './entities/auth-role.entity';
import { AuthResource } from './entities/auth-resource.entity';
import { AuthAction } from './entities/auth-action.entity';
import { AuthRolePermission } from './entities/auth-role-permission.entity';
import { AuthUserRole } from './entities/auth-user-role.entity';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      PropertyCustomRole,
      User,
      AuthRole,
      AuthResource,
      AuthAction,
      AuthRolePermission,
      AuthUserRole,
    ]),
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
