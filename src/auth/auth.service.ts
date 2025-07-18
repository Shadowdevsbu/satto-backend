import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
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
    private jwtService: JwtService,
  ) {}

  async signup(email: string, fname: string, password: string) {
    const existing = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existing) throw new BadRequestException('Email already in use');
    

    const hash = await bcrypt.hash(password, 10);

    await this.prisma.user.create({
      data: {
        email,
        full_name: fname,
        password: hash,
        isEmailConfirmed: false,
      },
    });

    const token = this.jwtService.sign(
      { email },
      {
        secret: jwtConstants.secret,
        expiresIn: jwtConstants.expiresIn,
      },
    );

    const confirmationLink = `${EMAIL_CONFIRMATION_URL}?token=${token}`;
    await this.emailService.sendConfirmationEmail(email, confirmationLink);

    return {
      message: 'Signup successful. Please check your email to confirm your account.',
    };
  }

  async login(email: string, password: string){
    const user = await this.prisma.user.findUnique({where: {email}})
    if(!user){throw new UnauthorizedException("invalid credidentials")}
    const passwordMatch = bcrypt.compare(password, user.password)
    if(!passwordMatch){throw new UnauthorizedException("invalid credidentials")
    }
    if(!user.isEmailConfirmed){throw new BadRequestException("Please verify your email to login")}
  
    const payload = {sub: user.id, email: user.email}
    const acessToken =  this.jwtService.sign(payload,{
        secret: jwtConstants.secret,
        expiresIn: jwtConstants.expiresIn
    })
    return{
        message:"Login Successful",
        acessToken,
        user: {
         id: user.id,
         name: user.full_name,
         email: user.email
        }
    }
}

  
  

  async confirmEmail(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      });

      const user = await this.prisma.user.findUnique({
        where: { email: payload.email },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (user.isEmailConfirmed) {
        return { message: 'Email already confirmed.' };
      }

      await this.prisma.user.update({
        where: { email: payload.email },
        data: { isEmailConfirmed: true },
      });

      return { message: 'Email confirmed successfully!' };
    } catch (err) {
      throw new BadRequestException('Invalid or expired confirmation token');
    }
  }
}
