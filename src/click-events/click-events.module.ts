import { Module } from '@nestjs/common';
import { ClickEventsProducer } from './click-events.producer';
import { ClickEventsConsumer } from './click-events.consumer';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'click-events',
    }),
  ],
  providers: [ClickEventsProducer, ClickEventsConsumer],
  exports: [ClickEventsProducer], // export so TrackingController can inject it
})
export class ClickEventsModule {}
