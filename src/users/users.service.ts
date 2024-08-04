import {
  // BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Equal, Repository } from 'typeorm';
import { Course } from 'src/courses/entities/course.entity';
import * as XLSX from 'xlsx';
import { isEqual } from 'lodash';
import mammoth from 'mammoth';
import { QrService } from './qr.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    private qrService: QrService,
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

  private float32ArrayToBase64(float32Array: Float32Array): string {
    const uint8Array = new Uint8Array(float32Array.buffer);
    let binary = '';
    for (let i = 0; i < uint8Array.byteLength; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return Buffer.from(binary, 'binary').toString('base64');
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOneBy({ userId: id });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Convert incoming face descriptions to Float32Arrays
      const newDescriptors = [
        updateUserDto.faceDescription1
          ? this.base64ToFloat32Array(updateUserDto.faceDescription1)
          : null,
        updateUserDto.faceDescription2
          ? this.base64ToFloat32Array(updateUserDto.faceDescription2)
          : null,
        updateUserDto.faceDescription3
          ? this.base64ToFloat32Array(updateUserDto.faceDescription3)
          : null,
        updateUserDto.faceDescription4
          ? this.base64ToFloat32Array(updateUserDto.faceDescription4)
          : null,
        updateUserDto.faceDescription5
          ? this.base64ToFloat32Array(updateUserDto.faceDescription5)
          : null,
      ];

      // Extract incoming images
      const newImages = [
        updateUserDto.image1 || null,
        updateUserDto.image2 || null,
        updateUserDto.image3 || null,
        updateUserDto.image4 || null,
        updateUserDto.image5 || null,
      ];

      // Convert existing face descriptions from JSON strings to Float32Arrays
      const existingDescriptors = [
        user.faceDescriptor1
          ? new Float32Array(JSON.parse(user.faceDescriptor1))
          : null,
        user.faceDescriptor2
          ? new Float32Array(JSON.parse(user.faceDescriptor2))
          : null,
        user.faceDescriptor3
          ? new Float32Array(JSON.parse(user.faceDescriptor3))
          : null,
        user.faceDescriptor4
          ? new Float32Array(JSON.parse(user.faceDescriptor4))
          : null,
        user.faceDescriptor5
          ? new Float32Array(JSON.parse(user.faceDescriptor5))
          : null,
      ];

      // Extract existing images
      const existingImages = [
        user.image1 || null,
        user.image2 || null,
        user.image3 || null,
        user.image4 || null,
        user.image5 || null,
      ];

      // Iterate over the new descriptors and update if not duplicate
      newDescriptors.forEach((newDescriptor, index) => {
        if (
          newDescriptor &&
          !this.isDuplicateDescriptor(newDescriptor, existingDescriptors)
        ) {
          // Update with new descriptor and image if not a duplicate
          existingDescriptors[index] = newDescriptor;
          existingImages[index] = newImages[index];
          console.log(`Updated descriptor and image at index ${index}`);
        } else {
          console.log(`Duplicate descriptor found at index ${index}`);
        }
      });

      // Convert updated descriptors back to JSON strings for storage
      user.faceDescriptor1 = existingDescriptors[0]
        ? JSON.stringify(Array.from(existingDescriptors[0]))
        : null;
      user.faceDescriptor2 = existingDescriptors[1]
        ? JSON.stringify(Array.from(existingDescriptors[1]))
        : null;
      user.faceDescriptor3 = existingDescriptors[2]
        ? JSON.stringify(Array.from(existingDescriptors[2]))
        : null;
      user.faceDescriptor4 = existingDescriptors[3]
        ? JSON.stringify(Array.from(existingDescriptors[3]))
        : null;
      user.faceDescriptor5 = existingDescriptors[4]
        ? JSON.stringify(Array.from(existingDescriptors[4]))
        : null;

      // Update user images
      user.image1 = existingImages[0];
      user.image2 = existingImages[1];
      user.image3 = existingImages[2];
      user.image4 = existingImages[3];
      user.image5 = existingImages[4];

      const updatedUser = await this.userRepository.save(user);
      console.log('Updated user:', updatedUser);
      return updatedUser;
    } catch (error) {
      console.log(error);
      throw new Error('Error updating user');
    }
  }

  private isDuplicateDescriptor(
    newDescriptor: Float32Array,
    existingDescriptors: (Float32Array | null)[],
  ): boolean {
    // Check if the new descriptor matches any of the existing descriptors
    for (const existingDescriptor of existingDescriptors) {
      if (
        existingDescriptor &&
        this.arraysEqual(existingDescriptor, newDescriptor)
      ) {
        return true; // Found a duplicate
      }
    }
    return false; // No duplicates found
  }

  private arraysEqual(a: Float32Array, b: Float32Array): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
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

  async findAll() {
    const users = await this.userRepository.find();
    return users.map((user) => {
      user.faceDescriptor1 = user.faceDescriptor1
        ? this.float32ArrayToBase64(
            new Float32Array(JSON.parse(user.faceDescriptor1)),
          )
        : null;
      user.faceDescriptor2 = user.faceDescriptor2
        ? this.float32ArrayToBase64(
            new Float32Array(JSON.parse(user.faceDescriptor2)),
          )
        : null;
      user.faceDescriptor3 = user.faceDescriptor3
        ? this.float32ArrayToBase64(
            new Float32Array(JSON.parse(user.faceDescriptor3)),
          )
        : null;
      user.faceDescriptor4 = user.faceDescriptor4
        ? this.float32ArrayToBase64(
            new Float32Array(JSON.parse(user.faceDescriptor4)),
          )
        : null;
      user.faceDescriptor5 = user.faceDescriptor5
        ? this.float32ArrayToBase64(
            new Float32Array(JSON.parse(user.faceDescriptor5)),
          )
        : null;
      return user;
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ userId: id });
    if (!user) {
      throw new NotFoundException('User not found');
    } else {
      user.faceDescriptor1 = user.faceDescriptor1
        ? this.float32ArrayToBase64(
            new Float32Array(JSON.parse(user.faceDescriptor1)),
          )
        : null;
      user.faceDescriptor2 = user.faceDescriptor2
        ? this.float32ArrayToBase64(
            new Float32Array(JSON.parse(user.faceDescriptor2)),
          )
        : null;
      user.faceDescriptor3 = user.faceDescriptor3
        ? this.float32ArrayToBase64(
            new Float32Array(JSON.parse(user.faceDescriptor3)),
          )
        : null;
      user.faceDescriptor4 = user.faceDescriptor4
        ? this.float32ArrayToBase64(
            new Float32Array(JSON.parse(user.faceDescriptor4)),
          )
        : null;
      user.faceDescriptor5 = user.faceDescriptor5
        ? this.float32ArrayToBase64(
            new Float32Array(JSON.parse(user.faceDescriptor5)),
          )
        : null;
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

  async getUserByCourseId(courseId: string) {
    try {
      const user = await this.userRepository.find({
        where: { enrollments: { course: Equal(courseId) } },
        relations: ['enrollments', 'enrollments.course'],
      });
      if (!user) {
        throw new NotFoundException('Course not found');
      } else {
        user.map((user) => {
          user.faceDescriptor1 = user.faceDescriptor1
            ? this.float32ArrayToBase64(
                new Float32Array(JSON.parse(user.faceDescriptor1)),
              )
            : null;
          user.faceDescriptor2 = user.faceDescriptor2
            ? this.float32ArrayToBase64(
                new Float32Array(JSON.parse(user.faceDescriptor2)),
              )
            : null;
          user.faceDescriptor3 = user.faceDescriptor3
            ? this.float32ArrayToBase64(
                new Float32Array(JSON.parse(user.faceDescriptor3)),
              )
            : null;
          user.faceDescriptor4 = user.faceDescriptor4
            ? this.float32ArrayToBase64(
                new Float32Array(JSON.parse(user.faceDescriptor4)),
              )
            : null;
          user.faceDescriptor5 = user.faceDescriptor5
            ? this.float32ArrayToBase64(
                new Float32Array(JSON.parse(user.faceDescriptor5)),
              )
            : null;
        });
        return user;
      }
    } catch (error) {
      throw new Error('Error fetching user');
    }
  }

  async generateQrCodeForOrder(link: string): Promise<string> {
    try {
      return await this.qrService.generateQr(link);
    } catch (error) {
      console.error('Failed to generate QR code for order:', error);
      throw new Error('Failed to generate QR code for order');
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
