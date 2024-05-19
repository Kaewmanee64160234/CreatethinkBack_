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
  async create(createUserDto: CreateUserDto, imageFile: Express.Multer.File) {
    try {
      const newUser = new User();
      if (imageFile) {
        const imageBase64 = imageFile.buffer.toString('base64');
        const imageData = `data:${imageFile.mimetype};base64,${imageBase64}`;
        newUser.profileImage = imageData;
      } else {
        newUser.profileImage = null;
      }
      newUser.firstName = createUserDto.firstName;
      newUser.lastName = createUserDto.lastName;
      newUser.email = createUserDto.email;
      newUser.role = createUserDto.role;
      newUser.status = createUserDto.status;
      newUser.studentId = createUserDto.studentId;
      newUser.teacherId = createUserDto.teacherId;
      const user = await this.userRepository.create(newUser);
      return await this.userRepository.save(user);
    } catch (error) {
      console.log(error);
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
    const user = await this.userRepository.findOneBy({
      email: userDto.email,
    });
    if (!user) {
      const newUser = new User();
      newUser.email = userDto.email;
      newUser.firstName = userDto.firstName;
      newUser.lastName = userDto.lastName;
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

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    imageFile: Express.Multer.File,
  ) {
    try {
      const newUser = new User();
      if (imageFile) {
        const imageBase64 = imageFile.buffer.toString('base64');
        const imageData = `data:${imageFile.mimetype};base64,${imageBase64}`;
        newUser.profileImage = imageData;
      } else {
        newUser.profileImage = null;
      }
      newUser.firstName = updateUserDto.firstName;
      newUser.lastName = updateUserDto.lastName;
      newUser.email = updateUserDto.email;
      newUser.role = updateUserDto.role;
      newUser.status = updateUserDto.status;
      newUser.studentId = updateUserDto.studentId;
      newUser.teacherId = updateUserDto.teacherId;
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

  //custom function find course by userId
  async findCourseByUserId(id: number) {
    const user = await this.userRepository.findOne({
      where: { userId: id },
      relations: ['courses'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.courses;
  }
}
