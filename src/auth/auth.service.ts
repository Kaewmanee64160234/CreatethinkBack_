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

<<<<<<< HEAD
  // async validateUser(email: string): Promise<any> {
  //   const user = await this.usersService.findOneByEmail(email);
  //   const isMatch = await bcrypt.compare(user.email);
=======
  // async validateUser(email: string, pass: string): Promise<any> {
  //   const user = await this.usersService.findOneByEmail(email);
  //   console.log(user.password);
  //   const isMatch = await bcrypt.compare(pass, user.password);
>>>>>>> 2e26ad387cf6f14fee5fbfe62994c89705b2d708
  //   if (user && isMatch) {
  //     const { password, ...result } = user;

  //     return result;
  //   }
  //   return null;
  // }

  async login(user: any) {
    const user_ = await this.usersService.findOne(user.id);
    const payload = { login: user.login, sub: user.id, role: user_.role };
    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }
}
