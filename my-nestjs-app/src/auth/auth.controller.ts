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
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    this.logger.log('Registration attempt', { email: registerDto.email }); // Логируем попытку регистрации

    try {
      const user = await this.authService.register(registerDto);
      this.logger.log('User registered successfully', { userId: user.user_id });
      return {
        message: 'User registered successfully',
        user,
      };
    } catch (error) {
      this.logger.error('Registration failed', error);
      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    this.logger.log('Login attempt', { email: loginDto.email }); // Логируем попытку входа

    try {
      const user = await this.authService.validateUser(
        loginDto.email,
        loginDto.password,
      );

      if (!user) {
        this.logger.warn('Invalid credentials', { email: loginDto.email }); // Логируем предупреждение при неверных данных
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = await this.authService.login(user);
      this.logger.log('Login successful', { userId: user.user_id });
      return {
        message: 'Login successful',
        accessToken: token,
      };
    } catch (error) {
      this.logger.error('Login failed', error);
      throw error;
    }
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req) {
    this.logger.log('Fetching user profile', { userId: req.user.user_id });

    return {
      message: 'User profile fetched successfully',
      user: req.user,
    };
  }
}
