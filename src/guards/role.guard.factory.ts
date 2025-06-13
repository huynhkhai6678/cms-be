import { RoleGuard } from './role.guard';
import { Type, Injectable, CanActivate, mixin } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

export function RoleGuardFactory(permission: string): Type<CanActivate> {
  @Injectable()
  class RoleGuardMixin extends RoleGuard {
    constructor(authService: AuthService) {
      super(authService, permission);
    }
  }

  return mixin(RoleGuardMixin);
}
