import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const host = this.configService.get<string>('REDIS_HOST');
    const port = this.configService.get<number>('REDIS_PORT');

    this.client = new Redis({ host, port });

    this.client.on('error', (err) => console.error('Redis Error', err));
    console.log(`Redis connected to ${host}:${port}`);
  }

  async onModuleDestroy() {
    await this.client.quit();
    console.log('Redis disconnected');
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number) {
    if (ttlSeconds) {
      await this.client.set(key, value, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string) {
    await this.client.del(key);
  }

  // JSON helpers
  async getJSON<T>(key: string): Promise<T | null> {
    const cached = await this.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  async setJSON(key: string, value: any, ttlSeconds?: number) {
    await this.set(key, JSON.stringify(value), ttlSeconds);
  }
}
