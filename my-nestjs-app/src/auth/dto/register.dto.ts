import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
} from 'class-validator';

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
  @IsInt()
  role?: {
    role_id: number;
    role_name: string;
  };
}
