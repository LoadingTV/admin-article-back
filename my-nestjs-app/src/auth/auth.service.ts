import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service'; // Убедитесь, что путь правильный
import { User } from '../users/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto'; // Импортируйте свой DTO

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.validateUser(email, password);
    if (user) {
      return user; // Возвращаем пользователя, если он найден
    }
    return null; // Возвращаем null, если не найден
  }

  async login(user: User) {
    // Измените 'id' на 'user_id'
    const payload = { email: user.email, user_id: user.user_id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getProfile(userId: number): Promise<User> {
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new InternalServerErrorException('User not found');
    }
    return user;
  }
}
