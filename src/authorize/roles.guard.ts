import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
// import { Repository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';
// import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/types/Role.enum';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);
//     if (!requiredRoles) {
//       return true;
//     } else {
//       const user = context.switchToHttp().getRequest();
//       if (user.user) {
//         let role = user.user.role;
//         console.log(user.user);
//         console.log(requiredRoles);
//         for (const role_ of requiredRoles) {
//           if (role === 'employee') {
//             role = 'owner';
//             console.log(role);
//             if (role_ === role.toLowerCase()) {
//               return true;
//             }
//           } else {
//             if (role_ === role.toLowerCase()) {
//               return true;
//             }
//           }
//         }
//         return false;
//       } else {
//         // console.log(user.user);
//         return true;
//       }
//     }
//   }
// }
