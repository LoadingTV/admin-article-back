import {
  Injectable,
  InternalServerErrorException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    try {
      this.logger.log(`Registering user with email: ${createUserDto.email}`);
      return await this.usersService.createUser(createUserDto);
    } catch (error) {
      this.logger.error(`Failed to register user: ${error.message}`);
      throw new InternalServerErrorException(
        'Could not register user. Please try again later.',
      );
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      this.logger.log(`Validating user with email: ${email}`);
      const user = await this.usersService.validateUser(email, password);
      if (!user) {
        this.logger.warn(`User not found for email: ${email}`);
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

  async login(user: User) {
    try {
      this.logger.log(`Logging in user with email: ${user.email}`);
      const payload = { email: user.email, user_id: user.user_id };
      const access_token = this.jwtService.sign(payload);
      return { access_token };
    } catch (error) {
      this.logger.error(`Error logging in user: ${error.message}`);
      throw new InternalServerErrorException(
        'Could not log in user. Please try again later.',
      );
    }
  }

  async getProfile(userId: number): Promise<User> {
    try {
      this.logger.log(`Fetching profile for user ID: ${userId}`);
      const user = await this.usersService.getUserById(userId);
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
