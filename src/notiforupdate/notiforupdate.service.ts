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
import * as nodemailer from 'nodemailer';
import { EmailService } from 'src/emails/emails.service';
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
    const newNotiforupdate = this.notiforupdateRepository.create({
      image1: createNotiforupdateDto.image1,
      image2: createNotiforupdateDto.image2,
      image3: createNotiforupdateDto.image3,
      image4: createNotiforupdateDto.image4,
      image5: createNotiforupdateDto.image5,
      faceDescriptor1: createNotiforupdateDto.faceDescriptor1,
      faceDescriptor2: createNotiforupdateDto.faceDescriptor2,
      faceDescriptor3: createNotiforupdateDto.faceDescriptor3,
      faceDescriptor4: createNotiforupdateDto.faceDescriptor4,
      faceDescriptor5: createNotiforupdateDto.faceDescriptor5,
      statusConfirmation: 'Pending', // Set initial status to 'Pending'

      // Add title and subtitle here
      title: 'New Image Update Request',
      subtitle: `Student with ID ${createNotiforupdateDto.userId} has requested to update their images.`, // or any other dynamic message
    });

    await this.notiforupdateRepository.save(newNotiforupdate);
    try {
      console.log('Data received in service:', createNotiforupdateDto.userId);

      const user = await this.userRepository.findOne({
        where: { userId: +createNotiforupdateDto.userId },
      });
      const userReceive = await this.userRepository.findOne({
        where: { userId: 1 },
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
      await this.sendEmailToTeacher(Number(userReceive.userId));

      return await this.notiforupdateRepository.save(newNotiforupdate);
    } catch (error) {
      console.error('Error during notification creation:', error);
      throw new BadRequestException('Invalid data provided');
    }
  }

  async sendEmailToTeacher(teacherId: number) {
    const teacherUser = await this.userRepository.findOne({
      where: { userId: teacherId },
    });
    if (!teacherUser) {
      throw new NotFoundException('Teacher not found');
    }
    const subject = 'New Image Update Request';
    const htmlContent = `
      <p>A student has requested to update their profile image.</p>
      <p>Please log in to review and approve or reject the request.</p>
    `;

    await this.emailService.sendEmail(teacherUser.email, subject, htmlContent);
  }

  private async getTeacherEmail(teacherId: number): Promise<string> {
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

  async confirmNotification(id: number) {
    const notification = await this.notiforupdateRepository.findOneBy({
      notiforupdateId: id,
    });
    if (!notification) throw new NotFoundException('Notification not found');

    // Find the user by the notification's userId
    const user = await this.userRepository.findOneBy({
      userId: notification.userId,
    });
    if (!user) throw new NotFoundException('User not found');

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

    // Save the status confirmation
    notification.statusConfirmation = 'confirmed';
    await this.notiforupdateRepository.save(notification);

    return { message: 'Notification confirmed and user updated' };
  }

  async rejectNotification(id: number) {
    const user = await this.userRepository.findOneBy({ userId: id });
    const notification = await this.notiforupdateRepository.findOneBy({
      notiforupdateId: id,
      userSender: user,
    });
    if (!notification) throw new NotFoundException('Notification not found');

    // Send email to student to re-upload image
    await this.sendReUploadEmail(notification.userReceive.userId);
    notification.statusConfirmation = 'rejected';
    await this.notiforupdateRepository.save(notification);

    return { message: 'Notification rejected and email sent' };
  }

  async sendReUploadEmail(userId: number) {
    const user = await this.userRepository.findOneBy({ userId });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Replace with actual email config from env variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // Set to true if using SSL
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Your Name" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Re-upload Required',
      html: `<p>Hello ${user.firstName},</p><p>Your recent upload did not meet the required standards. Please re-upload the necessary images.</p>`,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      return { message: 'Re-upload email sent successfully' };
    } catch (error) {
      console.error('Error sending email: %s', error.message);
      throw new Error('Failed to send re-upload email');
    }
  }

  findAll() {
    return this.notiforupdateRepository.find();
  }

  //findOne
  async findOne(id: number) {
    const notiforupdate = await this.notiforupdateRepository.findOneBy({
      notiforupdateId: id,
    });
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
}
