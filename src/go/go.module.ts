import { Module } from '@nestjs/common';
import { GoService } from './go.service';
import { GoController } from './go.controller';

@Module({
  controllers: [GoController],
  providers: [GoService],
})
export class GoModule {}
