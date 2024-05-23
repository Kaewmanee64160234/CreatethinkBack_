import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
<<<<<<< HEAD
    const user = await this.userRepository.findOneBy({ userId: payload.id });
    return { userId: payload.sub, login: payload.login, role: user.role };
=======
    const user_ = await this.userRepository.findOneBy({
      studentId: payload.id,
    });
    return { userId: payload.sub, login: payload.login, role: user_.role };
>>>>>>> 2e26ad387cf6f14fee5fbfe62994c89705b2d708
  }
}
