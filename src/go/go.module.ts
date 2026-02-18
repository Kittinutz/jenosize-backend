import { Module } from '@nestjs/common';
import { GoService } from './go.service';
import { GoController } from './go.controller';
import { ClickEventsModule } from '../click-events/click-events.module';

@Module({
  imports: [ClickEventsModule],
  controllers: [GoController],
  providers: [GoService],
})
export class GoModule {}
