import { PlatformEnum } from 'src/enum/platformEnum';

export class DailyClickCountDto {
  date: string;
  count: number;
}

export class ClickCountByProductDto extends DailyClickCountDto {
  productTitle: string;
}

export class ClickCountByCampaignDto extends DailyClickCountDto {
  campaignName: string;
}

export class ClickCountByMarketplaceDto extends DailyClickCountDto {
  platform: PlatformEnum;
}

export class ClickStats7dResponseDto {
  dates: string[]; // Array of 7 dates in YYYY-MM-DD format
  byProduct: ClickCountByProductDto[];
  byCampaign: ClickCountByCampaignDto[];
  byMarketplace: ClickCountByMarketplaceDto[];
}
