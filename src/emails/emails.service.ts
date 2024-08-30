import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'nayeli.hettinger88@ethereal.email',
        pass: '1CmQjGqBW2aFs41tSA',
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string) {
    await this.transporter.sendMail({
      from: process.env.USER_EMAIL,
      to,
      subject,
      text,
    });
  }
  async sendEmailWithEmbeddedImage(
    to: string,
    subject: string,
    text: string,
    imagePath: string,
  ) {
    const info = await this.transporter.sendMail({
      from: 'nayeli.hettinger88@ethereal.email',
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
