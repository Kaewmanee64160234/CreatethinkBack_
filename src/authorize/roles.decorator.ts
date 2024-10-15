import { SetMetadata } from '@nestjs/common';

// Decorator to set metadata for roles
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
