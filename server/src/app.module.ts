import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CodePenService } from './code-pen/code-pen.service';
import { RedisModule } from './redis/redis.module';
import { CodePenModule } from './code-pen/code-pen.module';

@Module({
  imports: [RedisModule, CodePenModule],
  controllers: [AppController],
  providers: [CodePenService],
})
export class AppModule {}
