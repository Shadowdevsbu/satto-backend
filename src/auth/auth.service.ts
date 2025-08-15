import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { EmailService } from './email/email.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants, EMAIL_CONFIRMATION_URL, RESET_PASSWORD_URL } from 'src/constant';
import { User } from '@prisma/client';

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

    if (existing){
      if (!existing.isEmailConfirmed) {
        // Resend verification link
        const token = this.jwtService.sign({ sub: existing.id });
        const confirmationLink = `${EMAIL_CONFIRMATION_URL}?token=${token}`;
        await this.emailService.sendConfirmationEmail(email, confirmationLink);
  
        return {
          message: 'Signup successful. Please check your email to confirm your account.',
        };
      }
        throw new BadRequestException('Email already in use');
    } 
    

    const hash = await bcrypt.hash(password, 10);

   const user = await this.prisma.user.create({
      data: {
        email,
        full_name: fname,
        password: hash,
        isEmailConfirmed: false,
      },
    });

    const token = this.jwtService.sign({sub: user.id });

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
    const acessToken =  this.jwtService.sign(payload)
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
      const {sub: userId} = this.jwtService.verify(token);

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (user.isEmailConfirmed) {
        return { message: 'Email already confirmed.' };
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: { isEmailConfirmed: true },
      });

      return { message: 'Email confirmed successfully!' };
    } catch (err) {
      throw new BadRequestException('Invalid or expired confirmation token');
    }
  }

  async requestReset(email: string){
  const user = await this.prisma.user.findUnique({where: {email}})
  if(!user){throw new UnauthorizedException("invalid credidentials")}

  const token = this.jwtService.sign({sub: user.id},)
  const confirmation_url = `${RESET_PASSWORD_URL}?token=${token}`;
  await this.emailService.sendResetPasswordEmail(email, confirmation_url);
  return{message: "Reset link sent check your email"}

  }

  async resetPassword(token, newPassword){
    try{
  const {sub: userId} = this.jwtService.verify(token)
  const user = await this.prisma.user.findUnique({where: {id: userId}})
  if(!user){throw new UnauthorizedException("Invalid Credidentials")}
  const hash = await bcrypt.hash(newPassword, 10);
  const updatePass = await this.prisma.user.update({
    where: {id: userId},
    data: {password: hash}
  })
  return{message: "Password Updated Successfully!!"}
}catch(err){
throw new UnauthorizedException("Invalid or expried reset password token")
}

} 

async validateGoogleUser(profile: any ): Promise<User> {
  //check if the google id exists
  let user = await this.prisma.user.findUnique({
    where: {googleId: profile.id}
  })
  if(user){
    return user
  }
//check if email is existing to update the google id and avatar url
  user = await this.prisma.user.findUnique({
    where: {email: profile.emails[0]?.value}
  })

  if(user){
    return this.prisma.user.update({
      where: {email: profile.emails[0]?.value},
      data:{
        googleId: profile.id,
        avatar_url: profile.photos[0]?.value
      }
    })
  }

  user = await this.prisma.user.create({
   data:{
    googleId: profile.id,
    email: profile.emails[0]?.value,
    full_name: profile.displayName,
    avatar_url: profile.photos[0]?.value,
    isEmailConfirmed: true
   }
  })

  return user
}

async generateGoogleAccessToken(user: User): Promise<{accessToken: string}>{
  const payload = {sub: user.id, email: user.email}

  return{
    accessToken: this.jwtService.sign(payload)
  }
}
}

