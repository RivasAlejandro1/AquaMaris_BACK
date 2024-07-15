import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '../enum/Role.enum';

@Injectable()
export class Guard_admin implements CanActivate {
  constructor(private reflector: Reflector) {} ///

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const hasRole = () => roles.some((role) => user?.role?.includes(role));
    console.log(user);
    console.log(user.role);
    
    const valid = user && user.role && hasRole();
    console.log(valid);
    

    if (!valid) throw new ForbiddenException('Unauthorized Access');

    return valid;
  }
}
