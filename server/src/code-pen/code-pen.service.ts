import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class CodePenService {
  constructor(private readonly redisService: RedisService) {}

  async getCodePens(): Promise<string> {
    const client = this.redisService.getClient();
    const value = await client.get('code-pen');
    return value || 'Not found';
  }
}
