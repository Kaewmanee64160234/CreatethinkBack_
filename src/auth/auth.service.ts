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

  async login(logInDto: Record<string, any>) {
    const existingUser = await this.userRepository.findOne({
      where: { email: logInDto.email },
    });
    console.log(existingUser);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    // check user profile image id duplicate notupdate if null or not duplicate update profile
    if (logInDto.profileImage) {
      if (existingUser.profileImage === null) {
        existingUser.profileImage = logInDto.profileImage;
        await this.userRepository.save(existingUser);
      } else if (existingUser.profileImage !== logInDto.profileImage) {
        existingUser.profileImage = logInDto.profileImage;
        await this.userRepository.save(existingUser);
        console.log('update profile image');
      }
    }
    // get nre user angain
    const newUser = await this.userRepository.findOne({
      where: { email: logInDto.email },
    });
    console.log(newUser);

    const payload = {
      login: newUser.email,
      sub: newUser.userId,
      role: newUser.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '3h',
    });

    return {
      user: newUser,
      access_token: accessToken,
    };
  }
}
