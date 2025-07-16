import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { EmailService } from './email/email.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants, EMAIL_CONFIRMATION_URL } from 'src/constant';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private jwtService: JwtService
  ) {}

  async signup(email: string, fname: string, password: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new BadRequestException('Email already in use');

    const hash = await bcrypt.hash(password, 10);

    await this.prisma.user.create({
      data: { email: email,
        full_name: fname,
         password: hash }
    });

    const token = this.jwtService.sign({ email }, {
      secret: jwtConstants.secret,
      expiresIn: jwtConstants.expiresIn,
    });

    const confirmationLink = `${EMAIL_CONFIRMATION_URL}?token=${token}`;
    await this.emailService.sendConfirmationEmail(email, confirmationLink);

    return { message: 'Signup successful. Please check your email.' };
  }

  async confirmEmail(token: string) {
    try {
      const payload = this.jwtService.verify(token, { secret: jwtConstants.secret });

      await this.prisma.user.update({
        where: { email: payload.email },
        data: { isEmailConfirmed: true }
      });

      return { message: 'Email confirmed!' };
    } catch (err) {
      throw new BadRequestException('Invalid or expired token');
    }
  }
}
