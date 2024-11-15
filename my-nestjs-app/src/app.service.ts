import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const roles = ['Admin', 'User', 'Manager'];

    for (const roleName of roles) {
      // Проверка, существует ли роль в базе данных по имени
      const existingRole = await this.prisma.role.findFirst({
        where: { role_name: roleName },
      });

      if (!existingRole) {
        // Если роли нет, создаем её (не указываем role_id, если это автоинкрементное поле)
        await this.prisma.role.create({
          data: { role_name: roleName },
        });
        console.log(`Role "${roleName}" created`);
      } else {
        console.log(`Role "${roleName}" already exists`);
      }
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
