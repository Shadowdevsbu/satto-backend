import { IsEmail,  IsString, MinLength, IsEnum } from 'class-validator';
import { Role } from '../enum/role.enum';

export class SignupDto {
  @IsEmail()
  email: string;


  @IsString()
  @MinLength(8)
  fname: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Role, { message: 'Role must be student, solver, or admin' })
  role: Role;
}
