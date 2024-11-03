import { IsEmail, IsNotEmpty, IsString,IsOptional } from 'class-validator';
import { Role } from '../../users/role.entity'; 

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  surname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  role?: Role;
}
