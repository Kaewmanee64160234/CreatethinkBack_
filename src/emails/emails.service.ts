import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.email.com',
      service: 'gmail',
      port: 587,
      secure: true,
      auth: {
        user: 'thanawuth.rod@gmail.com',
        pass: 'bzlaqnkguabsorrc',
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string) {
    const info = await this.transporter.sendMail({
      from: 'thanawuth.rod@gmail.com',
      subject: 'ระบบเช็คชื่อเถื่อน',
      to,
      html: `
      <p>${text}</p><br/>
    `,
      text,
    });
    // Check the email it really sends
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
      from: process.env.USER_EMAIL,
      to,
      subject,
      html: `
        <p>${text}</p><br/>
      `,
      attachments: [
        {
          filename: 'attendance_image.jpg', // Name to display in the email
          path: imagePath, // Path to the image file on your server
          cid: 'attendanceImage', // Content-ID reference in the email
        },
      ],
    });

    // Check the email it really sends
    console.log('Email sent to:', to + ' with embedded image:', imagePath);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
}
