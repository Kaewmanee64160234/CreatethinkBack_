import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async login(email: string) {
    const existingUser = await this.userRepository.findOne({
      where: { email: email },
    });
    console.log(existingUser);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const payload = {
      login: existingUser.email,
      sub: existingUser.userId,
      role: existingUser.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '24h', // Token expires in 24 hours
    });

    return {
      user: existingUser,
      access_token: accessToken,
    };
  }
}
