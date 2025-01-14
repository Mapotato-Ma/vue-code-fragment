import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';
import type { RedisClientType } from '@redis/client';

@Injectable()
export class RedisService {
  private client: RedisClientType;

  constructor() {
    // 创建一个redis连接
    this.client = createClient({
      url: 'redis://:redis_44f5jH@172.18.0.4:6379',
    });

    this.client.on('error', (err) => {
      console.log('Redis Client Error', err);
    });

    this.client.connect();
  }

  getClient() {
    return this.client;
  }
}
