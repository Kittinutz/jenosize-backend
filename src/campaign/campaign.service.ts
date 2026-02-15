import { Injectable } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CampaignService {
  constructor(private prisma: PrismaService) {}

  create(createCampaignDto: CreateCampaignDto) {
    return this.prisma.campaign.create({
      data: {
        name: createCampaignDto.name,
        UTMSource: createCampaignDto.UTMSource,
        UTMMedium: createCampaignDto.UTMMedium,
        UTMCampaign: createCampaignDto.UTMCampaign,
      },
    });
  }

  findAll() {
    return `This action returns all campaign`;
  }

  findOne(id: number) {
    return `This action returns a #${id} campaign`;
  }

  update(id: number, updateCampaignDto: UpdateCampaignDto) {
    return `This action updates a #${id} campaign`;
  }

  remove(id: number) {
    return `This action removes a #${id} campaign`;
  }
}
