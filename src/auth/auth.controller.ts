import { Controller, Post, Body, Get, Query, UseGuards, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
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
   
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req){

  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect (@Req() req: Request, @Res() res:Response){
    const {accessToken} = await this.authService.generateGoogleAccessToken(req.user as any)

    res.redirect(`http://localhost:5173/auth/callback?accessToken=${accessToken}`); 
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
