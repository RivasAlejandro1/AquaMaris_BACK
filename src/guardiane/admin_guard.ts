import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Roles } from 'src/enum/Role.enum';

@Injectable()
export class Guard_admin implements CanActivate {
  constructor(private reflector: Reflector) {} ///

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<Roles[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const res_roles = () =>
      roles.some((role) => {
        return user?.Role?.includes(role);
      });
    const valid = user && user.Role && res_roles();

    if (!valid) throw new ForbiddenException('Unauthorized Access');

    return valid;
  }
}
