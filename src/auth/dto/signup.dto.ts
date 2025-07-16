import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;


  @IsString()
  @MinLength(8)
  fname: string;

  @IsString()
  @MinLength(6)
  password: string;
}
