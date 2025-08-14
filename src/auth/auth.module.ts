import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailService } from './email/email.service';
import { GoogleStrategy } from './strategy/google.strategy';
import { jwtStrategy } from './strategy/jwt.strategy';
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
  providers: [AuthService, EmailService, GoogleStrategy],
})
export class AuthModule {}
