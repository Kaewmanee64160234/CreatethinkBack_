/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException('user not found');
    } else {
      return user;
    }
  }
  async login(userDto: CreateUserDto) {
    const user = await this.userRepository.findOneBy({
      email: userDto.email,
    });
    if (!user) {
      const newUser = new User();
      newUser.email = userDto.email;
      newUser.firstName = userDto.firstName;
      newUser.lastName = userDto.lastName;
      newUser.profileImage = userDto.imageProfile;
      //split @ to id
      const strId = userDto.email.split('@')[0];

      if (isNaN(Number(strId))) {
        newUser.role = 'teacher';
        newUser.teacherId = strId;
      } else {
        newUser.role = 'student';
        newUser.studentId = strId;
      }
      return await this.userRepository.save(newUser);
    } else {
      return user;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return await this.userRepository.save({
      ...user,
      ...updateUserDto,
    });
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.userRepository.softRemove(user);
  }
}
