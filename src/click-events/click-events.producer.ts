// click-events/click-events.producer.ts
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class ClickEventsProducer {
  constructor(@InjectQueue('click-events') private queue: Queue) {}

  async addClickEvent(urlId: string): Promise<void> {
    await this.queue.add('resolve-click', {
      urlId,
      timestamp: new Date().toISOString(),
    });
    console.log(`✅ Click event added to queue for urlId: ${urlId}`);
  }
}
