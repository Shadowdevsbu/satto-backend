import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailService } from './email/email.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constant';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule, 
    
    JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: {expiresIn:jwtConstants.expiresIn}
  })],
  controllers: [AuthController],
  providers: [AuthService, EmailService],
})
export class AuthModule {}
