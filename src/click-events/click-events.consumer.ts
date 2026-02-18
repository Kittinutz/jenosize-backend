// click-events/click-events.consumer.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Processor('click-events')
export class ClickEventsConsumer extends WorkerHost {
  private readonly logger = new Logger(ClickEventsConsumer.name);

  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case 'resolve-click':
        await this.resolveClick(job.data.urlId);
        break;
    }
  }

  private async resolveClick(urlId: string): Promise<void> {
    // 1. Get link with related data
    const link = await this.prisma.link.findUnique({
      where: { urlId },
      include: {
        marketPlaceProduct: true,
      },
    });

    if (!link) {
      this.logger.warn(`Link not found for urlId: ${urlId}`);
      return;
    }

    const { id: linkId, campaignId, marketPlaceProduct } = link;

    // 2. Save ClickEvent to DB
    await this.prisma.clickEvent.create({
      data: {
        linkId,
        urlId,
        campaignId,
        marketPlaceProductId: marketPlaceProduct?.id,
        productId: marketPlaceProduct?.productId,
        platform: marketPlaceProduct?.platform,
        clickedAt: new Date(),
      },
    });

    this.logger.log(
      `✅ ClickEvent saved — urlId: ${urlId}, campaign: ${campaignId}, platform: ${marketPlaceProduct?.platform}`,
    );
  }
}
