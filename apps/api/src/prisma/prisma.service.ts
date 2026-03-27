import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../prisma/client/generated/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    console.log('Prisma connecting...');
    await this.$connect();
    console.log('Prisma connected.');
  }

  async onModuleDestroy() {
    console.log('Prisma disconnecting...');
    await this.$disconnect();
    console.log('Prisma disconnected.');
  }
}
