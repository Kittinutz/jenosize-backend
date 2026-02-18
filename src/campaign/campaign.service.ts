import { Injectable } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { PrismaService } from '../prisma/prisma.service';
import { transformTextToKebabCase } from 'src/utils/transform';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';

@Injectable()
export class CampaignService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async create(createCampaignDto: CreateCampaignDto) {
    const baseUrl =
      this.configService.get<string>('BASE_URL') || 'http://localhost:3000';
    return await this.prisma.$transaction(async (tx) => {
      const campaignCreated = await tx.campaign.create({
        data: {
          name: createCampaignDto.name,
          UTMSource: createCampaignDto.UTMSource,
          UTMMedium: createCampaignDto.UTMMedium,
          UTMCampaign: transformTextToKebabCase(createCampaignDto.name),
          startDate: createCampaignDto.startDate,
          endDate: createCampaignDto.endDate,
          campaignsProducts: {
            create: createCampaignDto.productIds.map((productId) => {
              return {
                productId,
              };
            }),
          },
        },
      });
      const marketPlaceProductsId = await tx.marketPlaceProduct.findMany({
        where: {
          productId: {
            in: createCampaignDto.productIds,
          },
        },
      });

      await tx.link.createMany({
        data: marketPlaceProductsId.map((item) => {
          const uniqueId = nanoid(10);
          return {
            urlId: uniqueId,
            url: `${baseUrl}/go/${uniqueId}`,
            marketPlaceProductId: item.id,
            campaignId: campaignCreated.id,
          };
        }),
      });
      return await tx.campaign.findUnique({
        where: { id: campaignCreated.id },
        include: {
          campaignsProducts: {
            include: {
              product: {
                include: {
                  marketPlaceProducts: {
                    include: {
                      links: {
                        where: {
                          campaignId: campaignCreated.id,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
    });
  }

  findAll() {
    return this.prisma.campaign.findMany({
      include: {
        campaignsProducts: {
          include: {
            product: {
              include: {
                marketPlaceProducts: {
                  include: {
                    links: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  findOne(id: number | string) {
    return this.prisma.campaign.findUnique({
      where: { id: String(id) },
      include: {
        campaignsProducts: {
          include: {
            product: {
              include: {
                marketPlaceProducts: {
                  include: {
                    links: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  update(id: number | string, updateCampaignDto: UpdateCampaignDto) {
    return this.prisma.campaign.update({
      where: { id: String(id) },
      data: {
        name: updateCampaignDto.name,
        UTMSource: updateCampaignDto.UTMSource,
        UTMMedium: updateCampaignDto.UTMMedium,
        startDate: updateCampaignDto.startDate,
        endDate: updateCampaignDto.endDate,
      },
    });
  }

  remove(id: number | string) {
    return this.prisma.campaign.delete({
      where: { id: String(id) },
    });
  }
}
