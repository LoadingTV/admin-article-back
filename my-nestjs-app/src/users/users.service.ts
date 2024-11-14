import {
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Метод создания пользователя
  async createUser(createUserData: CreateUserDto) {
    try {
      let roleId = createUserData.role?.role_id;

      // Если роль не передана, используем роль по умолчанию (например, с role_id = 1)
      if (!roleId) {
        roleId = 1; // Вы можете изменить это на ID вашей роли по умолчанию
        this.logger.log('No role provided, using default role (ID: 1)');
      }

      // Получаем роль из базы данных
      const role = await this.prisma.role.findUnique({
        where: { role_id: roleId },
      });

      if (!role) {
        throw new NotFoundException(`Role with ID ${roleId} not found`);
      }

      // Создаем пользователя с выбранной или дефолтной ролью
      const user = await this.prisma.user.create({
        data: {
          ...createUserData,
          role: {
            connect: { role_id: roleId },
          },
        },
      });

      this.logger.log(`Creating user with role: ${role.role_name}`);
      return user;
    } catch (error) {
      this.logger.error('Failed to create user', error.stack);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  // Получение пользователя по ID
  async getUserById(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({
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
  async getAllUsers() {
    try {
      return await this.prisma.user.findMany();
    } catch (error) {
      this.logger.error('Failed to fetch users', error.stack);
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  // Валидация пользователя по email и паролю
  async validateUser(email: string, password: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      if (user && user.password === password) {
        return user;
      }
      return null;
    } catch (error) {
      this.logger.error(`Failed to validate user ${email}`, error.stack);
      throw new InternalServerErrorException('Failed to validate user');
    }
  }

  // Получение пользователя по email
  async findByEmail(email: string) {
    try {
      return await this.prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      this.logger.error(`Failed to find user by email: ${email}`, error.stack);
      throw new InternalServerErrorException('Failed to find user by email');
    }
  }
}
