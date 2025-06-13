import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { User } from '../entites/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly permission: string,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userInToken: User = request.user;

    if (!userInToken?.id) {
      throw new ForbiddenException('User ID missing in token');
    }

    const user = await this.authService.findWithRole(userInToken.id);
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const role = user?.role.permissions.filter((p) => {
      return p.name === this.permission;
    });
    if (!role.length) {
      return false;
    }

    return true;
  }
}
