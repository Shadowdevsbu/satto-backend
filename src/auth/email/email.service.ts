import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { confirmationTemplate } from './template/confirm-email.template';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendConfirmationEmail(email: string, url: string) {
    await this.transporter.sendMail({
      to: email,
      from: `"My App" <${process.env.EMAIL_FROM}>`,
      subject: 'Confirm Your Email',
      html: confirmationTemplate(url),
    });
  }
}
