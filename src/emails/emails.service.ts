import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      service: this.configService.get<string>('SMTP_SERVICE'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<boolean>('SMTP_SECURE'),
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string) {
    const info = await this.transporter.sendMail({
      from: this.configService.get<string>('SMTP_USER'),
      subject: 'ระบบเช็คชื่อเถื่อน',
      to,
      html: `<p>${text}</p><br/>`,
      text,
    });
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }

  async sendEmailWithEmbeddedImage(
    to: string,
    subject: string,
    text: string,
    imagePath: string,
  ) {
    subject = 'ระบบเช็คชื่อเข้าเรียนเถื่อน';
    const info = await this.transporter.sendMail({
      from: this.configService.get<string>('SMTP_USER'),
      to,
      subject,
      html: `<p>${text}</p><br/>`,
      attachments: [
        {
          filename: 'attendance_image.jpg',
          path: imagePath,
          cid: 'attendanceImage',
        },
      ],
    });

    console.log('Email sent to:', to + ' with embedded image:', imagePath);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
}
