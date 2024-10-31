// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED) // Устанавливаем статус 201 для успешного создания пользователя
  async register(@Body() registerDto: RegisterDto) {
    try {
      const user = await this.authService.register(registerDto);
      return {
        message: 'User registered successfully',
        user,
      };
    } catch (error) {
      // Здесь можно обработать ошибки, например, уже существующий пользователь
      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK) // Устанавливаем статус 200 для успешного входа
  
  async login(@Body() loginDto: LoginDto) {
    try {
      const user = await this.authService.validateUser(loginDto.email, loginDto.password);
  
      if (!user) {
        throw new UnauthorizedException('Invalid credentials'); 
      }
  
      const token = await this.authService.login(user);
      return {
        message: 'Login successful',
        accessToken: token,
      };
    } catch (error) {
      throw error; 
    }
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req) {
    return {
      message: 'User profile fetched successfully',
      user: req.user,
    };
  }
}
