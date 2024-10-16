import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNotiforupdateDto } from './dto/create-notiforupdate.dto';
import { UpdateNotiforupdateDto } from './dto/update-notiforupdate.dto';
import { Notiforupdate } from './entities/notiforupdate.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
// import * as nodemailer from 'nodemailer';
import { EmailService } from 'src/emails/emails.service';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class NotiforupdateService {
  constructor(
    @InjectRepository(Notiforupdate)
    private notiforupdateRepository: Repository<Notiforupdate>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService,
  ) {}

  // Create a notification fromData
  async create(createNotiforupdateDto: CreateNotiforupdateDto) {
    try {
      console.log('Data received in service:', createNotiforupdateDto.userId);
      console.log(
        'Data received in service:',
        createNotiforupdateDto.userRecieve,
      );

      const user = await this.userRepository.findOne({
        where: { userId: +createNotiforupdateDto.userId },
      });
      const userReceive = await this.userRepository.findOne({
        where: { userId: +createNotiforupdateDto.userRecieve }, // Dynamic user receive
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const newNotiforupdate = new Notiforupdate();
      newNotiforupdate.image1 = createNotiforupdateDto.image1;
      newNotiforupdate.image2 = createNotiforupdateDto.image2;
      newNotiforupdate.image3 = createNotiforupdateDto.image3;
      newNotiforupdate.image4 = createNotiforupdateDto.image4;
      newNotiforupdate.image5 = createNotiforupdateDto.image5;
      newNotiforupdate.faceDescriptor1 = createNotiforupdateDto.faceDescriptor1;
      newNotiforupdate.faceDescriptor2 = createNotiforupdateDto.faceDescriptor2;
      newNotiforupdate.faceDescriptor3 = createNotiforupdateDto.faceDescriptor3;
      newNotiforupdate.faceDescriptor4 = createNotiforupdateDto.faceDescriptor4;
      newNotiforupdate.faceDescriptor5 = createNotiforupdateDto.faceDescriptor5;
      newNotiforupdate.statusConfirmation = 'pending';

      newNotiforupdate.userSender = user;
      newNotiforupdate.userReceive = userReceive;

      //sendEmailToTeacher
      await this.sendEmailToTeacher(
        userReceive.firstName,
        userReceive.lastName,
        user,
      );

      return await this.notiforupdateRepository.save(newNotiforupdate);
    } catch (error) {
      console.error('Error during notification creation:', error);
      throw new BadRequestException('Invalid data provided');
    }
  }

  async sendEmailToTeacher(
    teacherFirstName: string,
    teacherLastName: string,
    userSender: User,
  ) {
    // Find the teacher based on first name and last name
    const teacherUser = await this.userRepository.findOne({
      where: {
        firstName: teacherFirstName,
        lastName: teacherLastName,
      },
    });

    // If the teacher is not found, throw an exception
    if (!teacherUser) {
      throw new NotFoundException('Teacher not found');
    }

    // Construct email subject and content
    const subject = 'คำขอยืนยันการอัปเดตภาพใหม่';
    const htmlContent = `
      <p>มีคำขอยืนยันการอัปเดตภาพจากนิสิตชื่อ ${userSender.firstName} ${userSender.lastName}.</p>
      <p>กรุณาเข้าสู่ระบบเพื่อตรวจสอบและอนุมัติหากข้อมูลนี้ถูกต้อง.</p>
    `;

    // Send an email to the teacher's email address
    await this.emailService.sendEmail(teacherUser.email, subject, htmlContent);
  }

  // Implement this method to fetch the teacher's email address
  private async getTeacherEmail(teacherId: number): Promise<string> {
    // Implement logic to get the teacher's email based on the teacherId
    // For example, you might fetch it from the Users table
    const teacher = await this.userRepository.findOne({
      where: { userId: teacherId },
    });
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }
    return teacher.email;
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

  private float32ArrayToJsonString(array: string): string {
    const floatArray = this.base64ToFloat32Array(array);
    return JSON.stringify(Array.from(floatArray));
  }

  private copyImages(
    sourceFolder: string,
    destinationFolder: string,
    filenames: string[],
  ) {
    // Ensure the destination folder exists
    if (!fs.existsSync(destinationFolder)) {
      fs.mkdirSync(destinationFolder, { recursive: true });
    }

    // Copy each image file from source to destination
    for (const filename of filenames) {
      const sourcePath = path.join(sourceFolder, filename);
      const destinationPath = path.join(destinationFolder, filename);
      fs.copyFileSync(sourcePath, destinationPath);
      console.log(`Copied ${sourcePath} to ${destinationPath}`);
    }
  }

  async confirmNotification(id: number) {
    // Fetch the notification by its ID
    const notification = await this.notiforupdateRepository.findOne({
      where: { notiforupdateId: id },
      relations: ['userSender', 'userReceive'],
    });
    console.log('Noti: ', notification);

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    const user = await this.userRepository.findOne({
      where: { userId: notification.userSender.userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user profile with new images
    user.image1 = notification.image1;
    user.image2 = notification.image2;
    user.image3 = notification.image3;
    user.image4 = notification.image4;
    user.image5 = notification.image5;
    user.faceDescriptor1 = notification.faceDescriptor1
      ? this.float32ArrayToJsonString(notification.faceDescriptor1)
      : null;
    user.faceDescriptor2 = notification.faceDescriptor2
      ? this.float32ArrayToJsonString(notification.faceDescriptor2)
      : null;
    user.faceDescriptor3 = notification.faceDescriptor3
      ? this.float32ArrayToJsonString(notification.faceDescriptor3)
      : null;
    user.faceDescriptor4 = notification.faceDescriptor4
      ? this.float32ArrayToJsonString(notification.faceDescriptor4)
      : null;
    user.faceDescriptor5 = notification.faceDescriptor5
      ? this.float32ArrayToJsonString(notification.faceDescriptor5)
      : null;
    await this.userRepository.save(user);

    // Define source and destination folders
    const sourceFolder = './notiforupdate_images';
    const destinationFolder = './user_images';

    // List of image filenames to copy
    const imagesToCopy = [
      notification.image1,
      notification.image2,
      notification.image3,
      notification.image4,
      notification.image5,
    ];

    // Copy the images from the source to the destination folder
    await this.copyImages(sourceFolder, destinationFolder, imagesToCopy);

    // // If confirm then send email เรียนคุณ userFirstName + user lastname
    // await this.emailService.sendEmail(
    //   notification.userSender.email,
    //   'ยืนยันการแจ้งเตือน',
    //   `การอัปโหลดล่าสุดของคุณได้รับการยืนยันแล้ว`,
    // );
    // Update the status confirmation for the notification and then delete after save
    notification.statusConfirmation = 'confirmed';
    await this.notiforupdateRepository.save(notification);
    // remove notice after save
    // await this.notiforupdateRepository.delete(notification.notiforupdateId);

    return {
      message: 'Notification confirmed, user updated, and images copied',
    };
  }

  //reject notification
  async rejectNotification(id: number) {
    // Fetch the notification by its ID
    const notification = await this.notiforupdateRepository.findOne({
      where: { notiforupdateId: id },
      relations: ['userSender'],
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    // Send an email to the user requesting re-upload
    // await this.sendReUploadEmail(notification.userSender.userId);

    //If reject then send an email
    // await this.emailService.sendEmail(
    //   notification.userSender.email,
    //   'การแจ้งเตือนถูกปฏิเสธ',
    //   `การอัปโหลดล่าสุดของคุณไม่ตรงตามมาตรฐานที่กำหนด โปรดอัปโหลดรูปภาพที่จำเป็นอีกครั้ง`,
    // );
    // Update the notification status to 'rejected'
    notification.statusConfirmation = 'rejected';
    await this.notiforupdateRepository.save(notification);
    // await this.notiforupdateRepository.delete(notification.notiforupdateId);

    return {
      message:
        'การอัปโหลดล่าสุดของคุณไม่ตรงตามมาตรฐานที่กำหนด โปรดอัปโหลดรูปภาพที่จำเป็นอีกครั้ง',
    };
  }

  //getNotification last created by userId
  async getNotificationLastCreated(userId: number) {
    const notifications = await this.notiforupdateRepository.find({
      where: { userSender: { userId: userId } },
      order: { createdDate: 'DESC' },
      take: 1,
    });

    if (!notifications || notifications.length === 0) {
      throw new NotFoundException('Notifications not found');
    }

    return notifications[0];
  }
  // async sendReUploadEmail(userId: number) {
  //   // Fetch user details by userId
  //   const user = await this.userRepository.findOneBy({ userId });

  //   if (!user) {
  //     throw new NotFoundException(`User with ID ${userId} not found`);
  //   }

  //   // Create a transporter object using the default SMTP transport
  //   const transporter = nodemailer.createTransport({
  //     host: 'smtp.example.com', // Your SMTP server
  //     port: 587, // Port (587 for TLS, 465 for SSL)
  //     secure: false, // true for 465, false for other ports
  //     auth: {
  //       user: 'your-email@example.com', // Your email address
  //       pass: 'your-email-password', // Your email password
  //     },
  //   });

  //   // Set up email data
  //   const mailOptions = {
  //     from: '"Your Name" <your-email@example.com>', // Sender address
  //     to: user.email, // Recipient address
  //     subject: 'Re-upload Required', // Subject line
  //     text: `Hello ${user.firstName},\n\nYour recent upload did not meet the required standards. Please re-upload the necessary images.\n\nThank you.\n\nBest regards,\nYour Team`, // Plain text body
  //     html: `<p>Hello ${user.firstName},</p><p>Your recent upload did not meet the required standards. Please re-upload the necessary images.</p><p>Thank you.</p><p>Best regards,<br>Your Team</p>`, // HTML body
  //   };

  //   // Send the email
  //   try {
  //     const info = await transporter.sendMail(mailOptions);
  //     console.log('Message sent: %s', info.messageId);
  //     return { message: 'Re-upload email sent successfully' };
  //   } catch (error) {
  //     console.error('Error sending email: %s', error.message);
  //     throw new Error('Failed to send re-upload email');
  //   }
  // }

  findAll() {
    return this.notiforupdateRepository.find();
  }

  //findOne
  async findOne(id: number) {
    const notiforupdate = await this.notiforupdateRepository.findOne({
      where: { notiforupdateId: id },
      relations: ['userSender', 'userReceive'],
    });

    console.log(notiforupdate);
    if (!notiforupdate) {
      throw new NotFoundException('Notification not found');
    }
    return notiforupdate;
  }

  // Update a notification
  async update(id: number, updateNotiforupdateDto: UpdateNotiforupdateDto) {
    const notiforupdate = await this.notiforupdateRepository.findOneBy({
      notiforupdateId: id,
    });
    if (!notiforupdate) {
      throw new NotFoundException('Notification not found');
    }
    this.notiforupdateRepository.merge(notiforupdate, updateNotiforupdateDto);
    return this.notiforupdateRepository.save(notiforupdate);
  }
  remove(id: number) {
    return this.notiforupdateRepository.delete(id);
  }

  async getNotificationByUserReceive(userId: number) {
    const notifications = await this.notiforupdateRepository.find({
      where: {
        userReceive: { userId }, // Match the userId in the relation
        statusConfirmation: 'pending', // Only get notifications with pending status
      },
      relations: ['userSender'], // Load userSender relations
      order: { createdDate: 'DESC' }, // Order by createdDate in descending order
    });

    if (!notifications || notifications.length === 0) {
      throw new NotFoundException('Notifications not found');
    }

    return notifications;
  }
}
