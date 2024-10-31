import {
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Создание нового пользователя
  async createUser(createUserData: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserData);
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      this.logger.error('Failed to create user', error.stack);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  // Получение пользователя по ID
  async getUserById(userId: number): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({
        where: { user_id: userId },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      return user;
    } catch (error) {
      this.logger.error(`Failed to fetch user with ID ${userId}`, error.stack);
      throw new InternalServerErrorException(
        `Failed to fetch user with ID ${userId}`,
      );
    }
  }

  // Получение всех пользователей
  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      this.logger.error('Failed to fetch users', error.stack);
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  // Валидация пользователя по email и паролю
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && user.password === password) {
      return user; // Возвращаем пользователя, если пароль совпадает
    }
    return null; // Возвращаем null, если пользователь не найден или пароль не совпадает
  }

  // Получение пользователя по email
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  // Получение пользователя по ID (необязательный, если он уже есть)
  async findUserById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { user_id: id } });
  }
}
