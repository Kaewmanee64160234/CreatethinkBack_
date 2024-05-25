import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
// import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private userService: Repository<User>,
  ) {}
  async login(user: User) {
    const user_ = await this.usersService.findOne(user.userId);
    const payload = { login: user.email, sub: user.userId, role: user_.role };
    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }
}
