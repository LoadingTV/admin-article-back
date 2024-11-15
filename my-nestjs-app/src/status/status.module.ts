import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { StatusService } from './status.service';
import { StatusController } from './status.controller';

@Module({
  imports: [PrismaModule],
  providers: [StatusService],
  exports: [StatusService],
  controllers: [StatusController],
})
export class StatusModule {}
