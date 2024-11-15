import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const roles = ['Admin', 'User', 'Manager'];
    const statuses = [
      { status_id: 1, name: 'Published' },
      { status_id: 2, name: 'Drafts' },
    ];

    // Проверка и создание ролей
    for (const roleName of roles) {
      const existingRole = await this.prisma.role.findFirst({
        where: { role_name: roleName },
      });

      if (!existingRole) {
        await this.prisma.role.create({
          data: { role_name: roleName },
        });
        console.log(`Role "${roleName}" created`);
      } else {
        console.log(`Role "${roleName}" already exists`);
      }
    }

    // Проверка и создание статусов
    for (const status of statuses) {
      const existingStatus = await this.prisma.status.findFirst({
        where: { status_id: status.status_id },
      });

      if (!existingStatus) {
        await this.prisma.status.create({
          data: {
            status_id: status.status_id,
            name: status.name,
          },
        });
        console.log(`Status "${status.name}" created`);
      } else {
        console.log(`Status "${status.name}" already exists`);
      }
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
