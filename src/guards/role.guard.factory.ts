import { RoleGuard } from './role.guard';
import { UsersService } from '../users/users.service';
import { Reflector } from '@nestjs/core';
import { Type, Injectable, CanActivate, mixin } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

export function RoleGuardFactory(permission: string): Type<CanActivate> {
  @Injectable()
  class RoleGuardMixin extends RoleGuard {
    constructor(authService: AuthService, reflector: Reflector) {
      super(authService, reflector, permission);
    }
  }

  return mixin(RoleGuardMixin);
}