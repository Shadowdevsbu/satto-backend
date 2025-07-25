import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto.email, dto.fname, dto.password);
  }

  @Post('signin')
  signin(@Body() dto:SignupDto){
    return this.authService.login(dto.email, dto.password)
  }
   
  @Get('confirm')
  confirm(@Query('token') token: string) {
    return this.authService.confirmEmail(token);
  }

  @Post("request-reset")
  request(@Body() dto:SignupDto){
    return this.authService.requestReset(dto.email)
  }

  @Post("reset")
  reset(@Query('token') token: string, @Body() dto: SignupDto ){
    return this.authService.resetPassword(token, dto.password)
  }
}
