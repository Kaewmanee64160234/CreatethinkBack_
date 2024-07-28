/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Equal, Like, Repository } from 'typeorm';
import { Course } from 'src/courses/entities/course.entity';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    //inject course
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
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

      newUser.faceDescriptor1 = createUserDto.faceDescription1
        ? this.float32ArrayToJsonString(createUserDto.faceDescription1)
        : null;
      newUser.faceDescriptor2 = createUserDto.faceDescription2
        ? this.float32ArrayToJsonString(createUserDto.faceDescription2)
        : null;
      newUser.faceDescriptor3 = createUserDto.faceDescription3
        ? this.float32ArrayToJsonString(createUserDto.faceDescription3)
        : null;
      newUser.faceDescriptor4 = createUserDto.faceDescription4
        ? this.float32ArrayToJsonString(createUserDto.faceDescription4)
        : null;
      newUser.faceDescriptor5 = createUserDto.faceDescription5
        ? this.float32ArrayToJsonString(createUserDto.faceDescription5)
        : null;

      newUser.image1 = createUserDto.image1;
      newUser.image2 = createUserDto.image2;
      newUser.image3 = createUserDto.image3;
      newUser.image4 = createUserDto.image4;
      newUser.image5 = createUserDto.image5;

      const user = await this.userRepository.save(newUser);
      console.log(user);

      return user;
    } catch (error) {
      console.log(error);
      throw new Error('Error creating user');
    }
  }

  private float32ArrayToJsonString(array: string): string {
    const floatArray = this.base64ToFloat32Array(array);
    return JSON.stringify(Array.from(floatArray));
  }

  private base64ToFloat32Array(base64: string): Float32Array {
    if (!base64) {
      throw new TypeError('The first argument must be of type string.');
    }
    const binaryString = Buffer.from(base64, 'base64').toString('binary');
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Float32Array(bytes.buffer);
  }

  processFile = (file) => {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Process the data to extract the fields
    const filteredData = jsonData.map((item) => {
      const idKey = Object.keys(item).find((key) =>
        /รหัสประจำตัว|รหัสนิสิต/.test(key),
      );

      // Use a regular expression to match either "ชื่อ" or "ชื่อ-สกุล"
      const nameKey = Object.keys(item).find((key) =>
        /ชื่อ|ชื่อ-สกุล|ชื่อ-นามสกุล/.test(key),
      );

      const majorKey = Object.keys(item).find((key) =>
        /สาขา|สาขาที่เรียน/.test(key),
      );

      const yearKey = Object.keys(item).find((key) =>
        /รหัสประจำตัว|รหัสนิสิต/.test(key),
      );

      return {
        id: item[idKey],
        name: item[nameKey],
        major: item[majorKey],
        year: item[yearKey].toString().substring(0, 2),
      };
    });
    console.log('Processed data:', filteredData);
    return filteredData;
  };

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
      // newUser.image2 = updateUserDto.image2;
      // newUser.image3 = updateUserDto.image3;
      // newUser.image4 = updateUserDto.image4;
      // newUser.image5 = updateUserDto.image5;
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
  //getUserByCouseId
  async getUserByCourseId(courseId: string) {
    try {
      const user = await this.userRepository.find({
        where: { enrollments: { course: Equal(courseId) } },
        relations: ['enrollments', 'enrollments.course'],
      });
      if (!user) {
        throw new NotFoundException('Course not found');
      } else {
        return user;
      }
    } catch (error) {
      throw new Error('Error fetching user');
    }
  }

  //getUserByStudentId
  async searchUsers(search: string): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.studentId LIKE :search', { search: `%${search}%` })
      .orWhere('user.teacherId LIKE :search', { search: `%${search}%` })
      .orWhere('user.firstName LIKE :search', { search: `%${search}%` })
      .orWhere('user.lastName LIKE :search', { search: `%${search}%` })
      .getMany();
  }
}
