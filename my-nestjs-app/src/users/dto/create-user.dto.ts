import { IsEmail, IsNotEmpty, IsString,IsOptional,IsInt } from 'class-validator';
import { Role } from '../../users/role.entity'; 

export class CreateUserDto {
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
  @IsInt()
  roleId?: number;
}
