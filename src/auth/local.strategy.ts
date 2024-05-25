<<<<<<< HEAD
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
=======
// import { Strategy } from 'passport-local';
// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { AuthService } from './auth.service';
>>>>>>> 5f5d19af6c2d2d08a6cbf6b32257e7a837d3256c

// @Injectable()
// export class LocalStrategy extends PassportStrategy(Strategy) {
//   constructor(private authService: AuthService) {
//     super();
//   }

// async validate(username: string, password: string): Promise<any> {
//   const user = await this.authService.validateUser(username, password);
//   if (!user) {
//     throw new UnauthorizedException();
//   }

//   return user;
// }
