import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotiforupdateDto } from './dto/create-notiforupdate.dto';
import { UpdateNotiforupdateDto } from './dto/update-notiforupdate.dto';
import { Notiforupdate } from './entities/notiforupdate.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotiforupdateService {
  constructor(
    @InjectRepository(Notiforupdate)
    private notiforupdateRepository: Repository<Notiforupdate>,
    private userRepository: Repository<User>,
  ) {}

  // Create a notification fromData
  async create(createNotiforupdateDto: CreateNotiforupdateDto) {
    const newNotiforupdate = this.notiforupdateRepository.create(
      createNotiforupdateDto,
    );
    return await this.notiforupdateRepository.save(newNotiforupdate);
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

    // Update user profile with new images
    const user = await this.userRepository.findOneBy({ userId: id });
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
    return { message: 'Notification confirmed and user updated' };
  }

  async rejectNotification(id: number) {
    const notification = await this.notiforupdateRepository.findOneBy({
      notiforupdateId: id,
      userId: id,
    });
    if (!notification) throw new NotFoundException('Notification not found');

    // Send email to student to re-upload image
    await this.sendReUploadEmail(notification.userId);

    return { message: 'Notification rejected and email sent' };
  }

  async sendReUploadEmail(userId: number) {
    // Fetch user details by userId
    const user = await this.userRepository.findOneBy({ userId });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.example.com', // Your SMTP server
      port: 587, // Port (587 for TLS, 465 for SSL)
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'your-email@example.com', // Your email address
        pass: 'your-email-password', // Your email password
      },
    });

    // Set up email data
    const mailOptions = {
      from: '"Your Name" <your-email@example.com>', // Sender address
      to: user.email, // Recipient address
      subject: 'Re-upload Required', // Subject line
      text: `Hello ${user.firstName},\n\nYour recent upload did not meet the required standards. Please re-upload the necessary images.\n\nThank you.\n\nBest regards,\nYour Team`, // Plain text body
      html: `<p>Hello ${user.firstName},</p><p>Your recent upload did not meet the required standards. Please re-upload the necessary images.</p><p>Thank you.</p><p>Best regards,<br>Your Team</p>`, // HTML body
    };

    // Send the email
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
