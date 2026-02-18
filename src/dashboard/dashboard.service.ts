import { Injectable } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import {
  ClickStats7dResponseDto,
  ClickCountByProductDto,
  ClickCountByCampaignDto,
  ClickCountByMarketplaceDto,
} from './dto/click-stats.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlatformEnum } from 'src/enum/platformEnum';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  create(_createDashboardDto: CreateDashboardDto) {
    return 'This action adds a new dashboard';
  }

  findAll() {
    return `This action returns all dashboard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dashboard`;
  }

  update(id: number, _updateDashboardDto: UpdateDashboardDto) {
    return `This action updates a #${id} dashboard`;
  }

  remove(id: number) {
    return `This action removes a #${id} dashboard`;
  }

  async getClickStats7d(): Promise<ClickStats7dResponseDto> {
    // Calculate date range: last 7 calendar days in UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setUTCDate(today.getUTCDate() - 6); // -6 to include today (7 days total)

    // Generate array of 7 dates for response
    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo);
      date.setUTCDate(sevenDaysAgo.getUTCDate() + i);
      dates.push(this.formatDateUTC(date));
    }

    // Query click events for the 7-day period with campaign and product relations
    const clickEvents = await this.prisma.clickEvent.findMany({
      where: {
        clickedAt: {
          gte: sevenDaysAgo,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Include today until 23:59:59
        },
      },
      select: {
        clickedAt: true,
        platform: true,
        campaign: {
          select: {
            name: true,
          },
        },
        marketPlaceProduct: {
          select: {
            product: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    // Aggregate by product (date + productTitle)
    const byProductMap = new Map<string, number>();
    const byCampaignMap = new Map<string, number>();
    const byMarketplaceMap = new Map<string, number>();

    for (const event of clickEvents) {
      // Skip if key dimensions are null
      if (
        event.campaign?.name &&
        event.marketPlaceProduct?.product?.title &&
        event.platform
      ) {
        const date = this.formatDateUTC(event.clickedAt);

        // By Product
        const productKey = `${date}|${event.marketPlaceProduct.product.title}`;
        const productCount = (byProductMap.get(productKey) || 0) + 1;
        byProductMap.set(productKey, productCount);

        // By Campaign
        const campaignKey = `${date}|${event.campaign.name}`;
        const campaignCount = (byCampaignMap.get(campaignKey) || 0) + 1;
        byCampaignMap.set(campaignKey, campaignCount);

        // By Marketplace/Platform
        const marketplaceKey = `${date}|${event.platform}`;
        const marketplaceCount =
          (byMarketplaceMap.get(marketplaceKey) || 0) + 1;
        byMarketplaceMap.set(marketplaceKey, marketplaceCount);
      }
    }

    // Convert maps to sorted arrays
    const byProduct: ClickCountByProductDto[] = Array.from(
      byProductMap.entries(),
    )
      .map(([key, count]) => {
        const [date, productTitle] = key.split('|');
        return { date, productTitle, count };
      })
      .sort((a, b) => {
        const dateComp = a.date.localeCompare(b.date);
        return dateComp !== 0
          ? dateComp
          : a.productTitle.localeCompare(b.productTitle);
      });

    const byCampaign: ClickCountByCampaignDto[] = Array.from(
      byCampaignMap.entries(),
    )
      .map(([key, count]) => {
        const [date, campaignName] = key.split('|');
        return { date, campaignName, count };
      })
      .sort((a, b) => {
        const dateComp = a.date.localeCompare(b.date);
        return dateComp !== 0
          ? dateComp
          : a.campaignName.localeCompare(b.campaignName);
      });

    const byMarketplace: ClickCountByMarketplaceDto[] = Array.from(
      byMarketplaceMap.entries(),
    )
      .map(([key, count]) => {
        const [date, platform] = key.split('|');
        return {
          date,
          platform: platform as PlatformEnum,
          count,
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      dates,
      byProduct,
      byCampaign,
      byMarketplace,
    };
  }

  private formatDateUTC(date: Date): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
