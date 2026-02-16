import { Injectable, NotFoundException } from '@nestjs/common';
import { Campaign } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GoService {
  constructor(private prisma: PrismaService) {}
  async findOne(id: string) {
    const link = await this.prisma.link.findUnique({
      where: { urlId: String(id) },
      include: {
        marketPlaceProduct: true,
        campaign: true,
      },
    });
    console.log({
      link,
    });
    if (!link || !link.campaign || !link.marketPlaceProduct) {
      throw new NotFoundException('Link not found');
    } else {
      const redirectUrl = new URL(link.marketPlaceProduct.url as string);
      redirectUrl.search = '';

      const { UTMSource, UTMMedium, UTMCampaign } = link.campaign as Campaign;

      const searchRawData = {
        utm_source: UTMSource,
        utm_medium: UTMMedium,
        utm_campaign: UTMCampaign,
      };
      const searchParams = new URLSearchParams();

      for (const [key, value] of Object.entries(searchRawData)) {
        if (value) {
          searchParams.append(key, value);
        }
      }
      redirectUrl.search = searchParams.toString();

      return redirectUrl.toString();
    }
  }
}
