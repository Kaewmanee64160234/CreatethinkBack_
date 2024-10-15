import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true; // If no roles are defined, allow access
    }

    const { user } = context.switchToHttp().getRequest();
    const userRoles = user?.role || []; // Get the roles from the user object

    // Check if any of the user's roles match the required roles
    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
