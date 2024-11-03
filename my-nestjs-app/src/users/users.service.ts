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
import { Role } from './role.entity'; 

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)  
    private roleRepository: Repository<Role>
  ) {}

  async createUser(createUserData: CreateUserDto): Promise<User> {
    // Загружаем роль с id 1 (или нужное значение) из базы данных
    const defaultRole = await this.roleRepository.findOne({ where: { id: 1 } });
    
    if (!defaultRole) {
      throw new InternalServerErrorException('Default role not found');
    }
  
    // Создаем пользователя с установленной ролью
    const user = this.userRepository.create({
      ...createUserData,
      role: defaultRole,
    });
  
    this.logger.log(`Creating user with role: ${user.role.name}`);
  
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      this.logger.error('Failed to create user', error.stack);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

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
}
