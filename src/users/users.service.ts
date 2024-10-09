import {
  BadRequestException,
  // BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Equal, Repository } from 'typeorm';
import { Course } from 'src/courses/entities/course.entity';
import * as XLSX from 'xlsx';
// import { isEqual } from 'lodash';
// import mammoth from 'mammoth';
import { QrService } from './qr.service';
import { join } from 'path';
import { promises as fsPromises } from 'fs';
import { Notiforupdate } from 'src/notiforupdate/entities/notiforupdate.entity';
import { EmailService } from 'src/emails/emails.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Notiforupdate)
    private notiforupdateRepository: Repository<Notiforupdate>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    private qrService: QrService,
    private emailService: EmailService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      // Check if email already exists
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }

      const newUser = new User();
      newUser.firstName = createUserDto.firstName;
      newUser.lastName = createUserDto.lastName;
      newUser.email = createUserDto.email;
      newUser.role = createUserDto.role;
      newUser.status = createUserDto.status;
      newUser.year = createUserDto.year;
      newUser.major = createUserDto.major;
      newUser.registerStatus = createUserDto.registerStatus;
      newUser.studentId = createUserDto.studentId;
      newUser.teacherId = createUserDto.teacherId;

      if (createUserDto.role === 'นิสิต') {
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
      }

      newUser.image1 = createUserDto.image1 || null;
      newUser.image2 = createUserDto.image2 || null;
      newUser.image3 = createUserDto.image3 || null;
      newUser.image4 = createUserDto.image4 || null;
      newUser.image5 = createUserDto.image5 || null;

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

    // Ensure that the length of the binary string is divisible by 4
    if (len % 4 !== 0) {
      throw new RangeError(
        'Byte length of Float32Array should be a multiple of 4',
      );
    }

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
        name: item[nameKey].replace(/นาย|นางสาว|นาง/g, '').trim(),
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

  async findOneByStudentId(id: string) {
    const user = await this.userRepository.findOneBy({ studentId: id });
    if (!user) {
      throw new NotFoundException('user not found');
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
      return user;
    }
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { userId: id },
      relations: ['enrollments'],
    });
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

      // Split email to determine if the user is a teacher, student, administrator
      const strId = userDto.email.split('@')[0];

      // Check if strId is 'admin' for administrators
      if (strId.toLowerCase() === 'admin') {
        newUser.role = 'แอดมิน';
      } else if (isNaN(Number(strId))) {
        newUser.role = 'อาจารย์';
        newUser.teacherId = strId;
      } else {
        newUser.role = 'นิสิต';
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
      // console.log('Updating user with ID:', id);
      // console.log('Update DTO:', updateUserDto);
      // Find the existing user by ID
      const user = await this.userRepository.findOneBy({ userId: id });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      // Check if studentId already exists
      if (updateUserDto.studentId) {
        const existingUser = await this.userRepository.findOneBy({
          studentId: updateUserDto.studentId,
        });
        if (existingUser && existingUser.userId !== id) {
          throw new BadRequestException('Student ID already exists');
        }
      }

      // Define the directory for user images
      const userImagesDir = join('./', 'user_images');
      if (
        updateUserDto.image1 &&
        updateUserDto.image2 &&
        updateUserDto.image3 &&
        updateUserDto.image4 &&
        updateUserDto.image5
      ) {
        // Determine which old images need to be deleted if they are being replaced
        const imagesToDelete: string[] = [];
        const oldImages = [
          user.image1,
          user.image2,
          user.image3,
          user.image4,
          user.image5,
        ];
        const newImages = [
          updateUserDto.image1,
          updateUserDto.image2,
          updateUserDto.image3,
          updateUserDto.image4,
          updateUserDto.image5,
        ];

        for (let i = 0; i < oldImages.length; i++) {
          if (oldImages[i] && oldImages[i] !== newImages[i]) {
            imagesToDelete.push(oldImages[i]);
          }
        }

        // Remove the old images from the user_images directory
        if (updateUserDto.image1 !== 'no-image') {
          console.log('Images to delete:', imagesToDelete);

          for (const imageFileName of imagesToDelete) {
            try {
              await this.removeImageFile(join(userImagesDir, imageFileName));
              console.log('Removed image file:', imageFileName);
            } catch (fileError) {
              console.error(
                `Failed to remove image file: ${imageFileName}`,
                fileError,
              );
            }
          }
        }
      }

      let updatedUserData;
      if (updateUserDto.role === 'นิสิต') {
        // Update the user with new data
        updatedUserData = {
          ...user,
          firstName: updateUserDto.firstName ?? user.firstName,
          lastName: updateUserDto.lastName ?? user.lastName,
          email: updateUserDto.email ?? user.email,
          role: updateUserDto.role ?? user.role,
          status: updateUserDto.status ?? user.status,
          year: updateUserDto.year ?? user.year,
          major: updateUserDto.major ?? user.major,
          studentId: updateUserDto.studentId ?? user.studentId,
          teacherId: updateUserDto.teacherId ?? user.teacherId,
          // adminId: updateUserDto.adminId ?? user.adminId,
          registerStatus: updateUserDto.registerStatus ?? user.registerStatus,
          image1: updateUserDto.image1 ?? user.image1,
          image2: updateUserDto.image2 ?? user.image2,
          image3: updateUserDto.image3 ?? user.image3,
          image4: updateUserDto.image4 ?? user.image4,
          image5: updateUserDto.image5 ?? user.image5,

          faceDescriptor1: updateUserDto.faceDescription1
            ? this.float32ArrayToJsonString(updateUserDto.faceDescription1)
            : user.faceDescriptor1,
          faceDescriptor2: updateUserDto.faceDescription2
            ? this.float32ArrayToJsonString(updateUserDto.faceDescription2)
            : user.faceDescriptor2,
          faceDescriptor3: updateUserDto.faceDescription3
            ? this.float32ArrayToJsonString(updateUserDto.faceDescription3)
            : user.faceDescriptor3,
          faceDescriptor4: updateUserDto.faceDescription4
            ? this.float32ArrayToJsonString(updateUserDto.faceDescription4)
            : user.faceDescriptor4,
          faceDescriptor5: updateUserDto.faceDescription5
            ? this.float32ArrayToJsonString(updateUserDto.faceDescription5)
            : user.faceDescriptor5,
        };
      } else {
        updatedUserData = {
          ...user,
          firstName: updateUserDto.firstName ?? user.firstName,
          lastName: updateUserDto.lastName ?? user.lastName,
          email: updateUserDto.email ?? user.email,
          role: updateUserDto.role ?? user.role,
          status: updateUserDto.status ?? user.status,
          year: updateUserDto.year ?? user.year,
          major: updateUserDto.major ?? user.major,
          studentId: updateUserDto.studentId ?? user.studentId,
          teacherId: updateUserDto.teacherId ?? user.teacherId,
          registerStatus: updateUserDto.registerStatus ?? user.registerStatus,
          image1:
            updateUserDto.image1 == 'no-image'
              ? user.image1
              : updateUserDto.image1,
          image2: updateUserDto.image2 ?? user.image2,
          image3: updateUserDto.image3 ?? user.image3,
          image4: updateUserDto.image4 ?? user.image4,
          image5: updateUserDto.image5 ?? user.image5,
        };
      }

      const updatedUser = await this.userRepository.save(updatedUserData);
      // console.log('Updated user:', updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Error updating user');
    }
  }

  async requestImageUpdate(id: number, updateUserDto: UpdateUserDto) {
    try {
      // console.log('Requesting image update for user with ID:', id);
      // console.log('Update DTO:', updateUserDto);

      // Find the existing user by ID
      const user = await this.userRepository.findOneBy({ userId: id });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (updateUserDto.role === 'นิสิต') {
        // Create a notification for the teacher
        const notification = new Notiforupdate();
        notification.userSender.userId = user.userId;
        notification.userReceive.userId = +user.teacherId;
        notification.image1 = updateUserDto.image1;
        notification.image2 = updateUserDto.image2;
        notification.image3 = updateUserDto.image3;
        notification.image4 = updateUserDto.image4;
        notification.image5 = updateUserDto.image5;
        notification.statusConfirmation = 'pending';
        await this.notiforupdateRepository.save(notification);

        // Notify the teacher
        await this.notifyTeacher(user.teacherId, user);
      }

      return { message: 'Image update request sent to teacher for approval' };
    } catch (error) {
      console.error('Error requesting image update:', error);
      throw new Error('Error requesting image update');
    }
  }

  private async notifyTeacher(teacherId: string, user: User) {
    if (!teacherId) {
      console.warn('No teacher assigned to the student');
      return;
    }

    const teacher = await this.userRepository.findOneBy({ teacherId });
    if (!teacher) {
      console.warn('Teacher not found');
      return;
    }

    const email = teacher.email;
    const subject = 'นักเรียนได้ส่งคำขออัปเดตภาพโปรไฟล์';
    const htmlContent = `
        <p>เรียน อาจารย์ ${teacher.firstName} ${teacher.lastName},</p>
        <p>นักเรียน ${user.firstName} ${user.lastName} ได้ส่งคำขออัปเดตภาพโปรไฟล์</p>
        <p>กรุณาเข้าไปตรวจสอบที่: http://localhost:5173/notifications</p>
        <p>ด้วยความเคารพ,</p>
        <p><strong>ระบบการจัดการการเรียนการสอน</strong></p>
    `;

    await this.emailService.sendEmail(email, subject, htmlContent);
  }

  async approveImageUpdate(notificationId: number) {
    const notification = await this.notiforupdateRepository.findOneBy({
      notiforupdateId: notificationId,
    });
    if (!notification) throw new NotFoundException('Notification not found');

    const user = await this.userRepository.findOneBy({
      userId: notification.userSender.userId,
    });
    if (!user) throw new NotFoundException('User not found');

    // Update user's images
    user.image1 = notification.image1;
    user.image2 = notification.image2;
    user.image3 = notification.image3;
    user.image4 = notification.image4;
    user.image5 = notification.image5;

    // Save the user with the new images
    await this.userRepository.save(user);

    // Update the notification status
    notification.statusConfirmation = 'approved';
    await this.notiforupdateRepository.save(notification);

    return { message: 'Image update approved and user profile updated' };
  }

  async rejectImageUpdate(notificationId: number) {
    const notification = await this.notiforupdateRepository.findOneBy({
      notiforupdateId: notificationId,
    });
    if (!notification) throw new NotFoundException('Notification not found');

    // Update the notification status
    notification.statusConfirmation = 'rejected';
    await this.notiforupdateRepository.save(notification);

    // Notify the student that their request was rejected
    const user = await this.userRepository.findOneBy({
      userId: notification.userReceive.userId,
    });
    if (!user) throw new NotFoundException('User not found');

    const email = user.email;
    const subject = 'คำขออัปเดตภาพของคุณถูกปฏิเสธ';
    const htmlContent = `
        <p>เรียน ${user.firstName} ${user.lastName},</p>
        <p>คำขออัปเดตภาพโปรไฟล์ของคุณถูกปฏิเสธโดยอาจารย์ผู้สอน</p>
        <p>กรุณาอัปโหลดภาพใหม่หรือติดต่ออาจารย์</p>
        <p>ด้วยความเคารพ,</p>
        <p><strong>ระบบการจัดการการเรียนการสอน</strong></p>
    `;
    await this.emailService.sendEmail(email, subject, htmlContent);

    return { message: 'Image update rejected and student notified' };
  }

  async updateRegisterStatus(id: number, updateUserDto: UpdateUserDto) {
    try {
      console.log('Updating user registerStatus with ID:', id);
      console.log('UpdateUserDto:', updateUserDto);

      // Find the existing user by ID
      const user = await this.userRepository.findOneBy({ userId: id });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      user.registerStatus = updateUserDto.registerStatus;

      // Save the updated user
      const updatedUser = await this.userRepository.save(user);
      console.log('Updated user registerStatus:', updatedUser);

      // Ensure the email exists
      if (!updatedUser.email) {
        throw new Error('User email is missing');
      }

      // const email = updatedUser.email;
      // let subject = '';
      // let htmlContent = '';

      // if (updatedUser.registerStatus === 'confirmed') {
      //   console.log('Sending email confirmed');
      //   subject = 'สถานะการลงทะเบียน: ยืนยันแล้ว';
      //   htmlContent = `
      //   <p>เรียนคุณ ${updatedUser.firstName} ${updatedUser.lastName},</p>
      //   <p>สถานะการลงทะเบียนของคุณได้รับการยืนยันเรียบร้อยแล้ว</p>
      //   <p>สามารถตรวจสอบการลงทะเบียนของคุณได้ที่ http://localhost:5173/userProfile </p>
      //   <p>ด้วยความเคารพ,</p>
      //   <p><strong>ระบบการเช็คชื่อเถื่อน</strong></p>
      // `;
      //   await this.emailService.sendEmail(email, subject, htmlContent);
      // }
      // if (updatedUser.registerStatus === 'reConfirmed') {
      //   console.log('Sending email notConfirmed');
      //   subject = 'สถานะการลงทะเบียน: ถูกปฎิเสธ';
      //   htmlContent = `
      //   <p>เรียนคุณ ${updatedUser.firstName} ${updatedUser.lastName},</p>
      //   <p>สถานะการลงทะเบียนของคุณยังไม่ได้รับการยืนยัน</p>
      //   <p>กรุณาตรวจสอบและยืนยันข้อมูลของคุณอีกครั้งโดยเร็วที่สุดได้ที่ http://localhost:5173/userProfile</p>
      //   <p>ด้วยความเคารพ,</p>
      //   <p><strong>ระบบการเช็คชื่อเถื่อน</strong></p>
      // `;
      //   await this.emailService.sendEmail(email, subject, htmlContent);
      // } else {
      //   throw new Error('Unknown register status');
      // }

      return updatedUser;
    } catch (error) {
      console.error('Error updating user registerStatus:', error);
      throw new Error('Error updating user registerStatus');
    }
  }

  private async removeImageFile(filePath: string): Promise<void> {
    try {
      await fsPromises.unlink(filePath);
      console.log(`Removed file: ${filePath}`);
    } catch (error) {
      console.error(`Failed to remove file at path: ${filePath}`, error);
      throw new Error(`Failed to remove file: ${filePath}`);
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
          try {
            user.faceDescriptor1 = user.faceDescriptor1
              ? this.float32ArrayToBase64(
                  new Float32Array(JSON.parse(user.faceDescriptor1)),
                )
              : null;
          } catch (e) {
            console.error('Error parsing faceDescriptor1:', e);
            user.faceDescriptor1 = null;
          }

          try {
            user.faceDescriptor2 = user.faceDescriptor2
              ? this.float32ArrayToBase64(
                  new Float32Array(JSON.parse(user.faceDescriptor2)),
                )
              : null;
          } catch (e) {
            console.error('Error parsing faceDescriptor2:', e);
            user.faceDescriptor2 = null;
          }

          try {
            user.faceDescriptor3 = user.faceDescriptor3
              ? this.float32ArrayToBase64(
                  new Float32Array(JSON.parse(user.faceDescriptor3)),
                )
              : null;
          } catch (e) {
            console.error('Error parsing faceDescriptor3:', e);
            user.faceDescriptor3 = null;
          }

          try {
            user.faceDescriptor4 = user.faceDescriptor4
              ? this.float32ArrayToBase64(
                  new Float32Array(JSON.parse(user.faceDescriptor4)),
                )
              : null;
          } catch (e) {
            console.error('Error parsing faceDescriptor4:', e);
            user.faceDescriptor4 = null;
          }

          try {
            user.faceDescriptor5 = user.faceDescriptor5
              ? this.float32ArrayToBase64(
                  new Float32Array(JSON.parse(user.faceDescriptor5)),
                )
              : null;
          } catch (e) {
            console.error('Error parsing faceDescriptor5:', e);
            user.faceDescriptor5 = null;
          }
        });

        return user;
      }
    } catch (error) {
      console.error('Error fetching user:', error);
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
  // users.service.ts
  async getUsersByRole(role: string) {
    try {
      // Assuming you're using TypeORM and have a `role` field in your User entity
      const users = await this.userRepository.find({ where: { role } });
      return users;
    } catch (error) {
      console.error('Error fetching users by role:', error);
      throw new InternalServerErrorException('Failed to fetch users by role');
    }
  }

  async searchUsers(search: string): Promise<User[]> {
    return (
      this.userRepository
        .createQueryBuilder('user')
        .where('user.studentId LIKE :search', { search: `%${search}%` })
        // .orWhere('user.adminId LIKE :search', { search: `%${search}%` })
        // .orWhere('user.teacherId LIKE :search', { search: `%${search}%` })
        .orWhere('user.firstName LIKE :search', { search: `%${search}%` })
        .orWhere('user.lastName LIKE :search', { search: `%${search}%` })
        .orWhere("CONCAT(user.firstName, ' ', user.lastName) LIKE :search", {
          search: `%${search}%`,
        })
        .orWhere('user.year LIKE :search', { search: `%${search}%` })
        .getMany()
    );
  }
  async searchUsersYear(search: string): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.year LIKE :search', { search: `%${search}%` })
      .getMany();
  }

  //searchMajor
  async searchUsersMajor(search: string): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.major LIKE :search', { search: `%${search}%` })
      .getMany();
  }
  //checkEmailDuplicate
  async checkEmailDuplicate(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  //searchUsersStatus
  async searchUsersStatus(search: string): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.status LIKE :search', { search: `%${search}%` })
      .getMany();
  }

  //getUserPaginations
  async getUserPagination(
    page: number,
    limit: number,
  ): Promise<{ data: User[]; total: number }> {
    console.log('page:', page);
    console.log('limit:', limit);

    const [data, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }
  //checkStudentIdDuplicate
  async checkStudentIdDuplicate(studentId: string): Promise<User> {
    return this.userRepository.findOne({ where: { studentId } });
  }
}
