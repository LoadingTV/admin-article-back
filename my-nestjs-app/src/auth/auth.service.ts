import {
  Injectable,
  InternalServerErrorException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client'; // Импортируем тип User из Prisma

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService, // Используем PrismaService
    private readonly jwtService: JwtService,
  ) {}

  // Регистрация пользователя
  async register(createUserDto: CreateUserDto): Promise<User> {
    try {
      this.logger.log(`Registering user with email: ${createUserDto.email}`);
      const existingUser = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new BadRequestException('User with this email already exists');
      }

      const { role_id, role_name } = createUserDto.role || {};
      const user = await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          surname: createUserDto.surname,
          email: createUserDto.email,
          password: createUserDto.password,
          role_id: role_id || 1,
        },
      });

      return user;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to register user: ${error.message}`);
      throw new InternalServerErrorException(
        'Could not register user. Please try again later.',
      );
    }
  }

  // Валидация пользователя по email и паролю
  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      this.logger.log(`Validating user with email: ${email}`);
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user || user.password !== password) {
        this.logger.warn(`Invalid credentials for email: ${email}`);
        return null;
      }

      return user;
    } catch (error) {
      this.logger.error(`Error validating user: ${error.message}`);
      throw new InternalServerErrorException(
        'Could not validate user. Please try again later.',
      );
    }
  }

  // Логин и генерация токена
  async login(user: User) {
    try {
      this.logger.log(`Logging in user with email: ${user.email}`);
      const payload = { email: user.email, user_id: user.user_id };
      const access_token = this.jwtService.sign(payload);
      this.logger.log(`Generated access token: ${access_token}`);
      return { access_token };
    } catch (error) {
      this.logger.error(`Error logging in user: ${error.message}`);
      throw new InternalServerErrorException(
        'Could not log in user. Please try again later.',
      );
    }
  }

  // Получение профиля пользователя по ID
  async getProfile(userId: number): Promise<User> {
    try {
      this.logger.log(`Fetching profile for user ID: ${userId}`);
      const user = await this.prisma.user.findUnique({
        where: { user_id: userId },
      });
      if (!user) {
        this.logger.warn(`User not found for ID: ${userId}`);
        throw new InternalServerErrorException('User not found');
      }
      return user;
    } catch (error) {
      this.logger.error(`Error fetching user profile: ${error.message}`);
      throw new InternalServerErrorException(
        'Could not fetch user profile. Please try again later.',
      );
    }
  }
}
