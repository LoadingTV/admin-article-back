import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client;

  async onModuleInit() {
    this.client = createClient({
      url: 'redis://localhost:6379',
    });
    await this.client.connect();
  }

  async set(key: string, value: string, ttl: number) {
    await this.client.set(key, value, {
      EX: ttl,
    });
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async disconnect() {
    await this.client.quit();
  }
}
