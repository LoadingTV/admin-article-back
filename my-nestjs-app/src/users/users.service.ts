import {
    Injectable,
    Logger,
    InternalServerErrorException,
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
    ) { }

    async createUser(createUserData: CreateUserDto): Promise<User> {
        const user = this.userRepository.create(createUserData);
        try {
            return await this.userRepository.save(user);
        } catch (error) {
            this.logger.error('Failed to create user', error.stack);
            throw new InternalServerErrorException('Failed to create user');
        }
    }

    async getUserById(userId: number): Promise<User | null> {
        try {
            return await this.userRepository.findOne({ where: { user_id: userId } });
        } catch (error) {
            this.logger.error(`Failed to fetch user with ID ${userId}`, error.stack);
            throw new InternalServerErrorException(`Failed to fetch user with ID ${userId}`);
        }
    }

    async getAllUsers(): Promise<User[]> {
        try {
            return await this.userRepository.find();
        } catch (error) {
            this.logger.error('Failed to fetch users', error.stack);
            throw new InternalServerErrorException('Failed to fetch users');
        }
    }
}
