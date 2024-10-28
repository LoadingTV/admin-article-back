// redis.module.ts
import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const client = createClient({
          url: 'redis://localhost:6379', // URL вашего Redis
        });
        client.connect();
        return client;
      },
    },
    RedisService,
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
