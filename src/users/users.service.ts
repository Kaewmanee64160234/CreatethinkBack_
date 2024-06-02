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
    try {
      const newUser = new User();
      newUser.firstName = createUserDto.firstName;
      newUser.lastName = createUserDto.lastName;
      newUser.email = createUserDto.email;
      newUser.role = createUserDto.role;
      newUser.status = createUserDto.status;
      newUser.studentId = createUserDto.studentId;
      newUser.teacherId = createUserDto.teacherId;
      newUser.image1 = createUserDto.image1;
      newUser.image2 = createUserDto.image2;
      newUser.image3 = createUserDto.image3;
      newUser.image4 = createUserDto.image4;
      newUser.image5 = createUserDto.image5;

      const user = await this.userRepository.create(newUser);
      return await this.userRepository.save(user);
    } catch (error) {
      console.log(error);
      throw new Error('Error creating user');
    }
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ userId: id });
    if (!user) {
      throw new NotFoundException('user not found');
    } else {
      return user;
    }
  }
  async login(userDto: CreateUserDto) {
    // Check if the user already exists by email
    const user = await this.userRepository.findOneBy({
      email: userDto.email,
    });
    if (!user) {
      // If the user doesn't exist, create a new user
      const newUser = new User();
      newUser.email = userDto.email;
      newUser.firstName = userDto.firstName;
      newUser.lastName = userDto.lastName;

      // Split email to determine if the user is a teacher or student
      const strId = userDto.email.split('@')[0];

      if (isNaN(Number(strId))) {
        newUser.role = 'teacher';
        newUser.teacherId = strId;
      } else {
        newUser.role = 'student';
        newUser.studentId = strId;
      }

      // Save the new user and return it
      return await this.userRepository.save(newUser);
    } else {
      // If user exists, return the existing user
      return user;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const newUser = new User();
      newUser.firstName = updateUserDto.firstName;
      newUser.lastName = updateUserDto.lastName;
      newUser.email = updateUserDto.email;
      newUser.role = updateUserDto.role;
      newUser.status = updateUserDto.status;
      newUser.studentId = updateUserDto.studentId;
      newUser.teacherId = updateUserDto.teacherId;
      newUser.image1 = updateUserDto.image1;
      newUser.image2 = updateUserDto.image2;
      newUser.image3 = updateUserDto.image3;
      newUser.image4 = updateUserDto.image4;
      newUser.image5 = updateUserDto.image5;
      const user = await this.userRepository.findOneBy({ userId: id });
      return await this.userRepository.save({ ...user, ...newUser });
    } catch (error) {}
  }

  async remove(id: number) {
    console.log(id);
    const user = await this.userRepository.findOneBy({ userId: id });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.userRepository.softRemove(user);
  }

  async findOneByEmail(name: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: name }, // Here we are using the email to find the user
      });
      if (user) {
        return user;
      } else {
        throw new NotFoundException();
      }
    } catch (e) {
      console.log(e);
    }
  }
}
