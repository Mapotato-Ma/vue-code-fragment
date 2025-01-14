import { Controller, Post } from '@nestjs/common';
import { CodePenService } from 'src/code-pen/code-pen.service';

@Controller()
export class AppController {
  constructor(private readonly codePenService: CodePenService) {}

  // 从redis获取code-pen
  @Post('/getPens')
  async getPens() {
    return await this.codePenService.getCodePens();
  }
}
