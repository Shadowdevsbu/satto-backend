import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { confirmationTemplate } from './template/confirm-email.template';

@Injectable()
export class EmailService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendConfirmationEmail(email: string, confirmationUrl: string) {
    await this.resend.emails.send({
      from: process.env.EMAIL_FROM ?? 'onboarding@resend.dev', // fallback during dev
      to: email,
      subject: 'Confirm Your Email',
      html: confirmationTemplate(confirmationUrl),
    });
  }
}
