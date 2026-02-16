import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateCampaignDto {
  @ApiProperty({ example: 'Q1 Promo' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'google' })
  @IsString()
  @IsNotEmpty()
  UTMSource: string;

  @ApiProperty({ example: 'cpc' })
  @IsString()
  @IsNotEmpty()
  UTMMedium: string;

  @ApiProperty({ example: ['prod_123', 'prod_456'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  productIds: string[];

  @ApiProperty({ example: '2026-02-16T00:00:00.000Z', format: 'date-time' })
  @IsDateString()
  startDate: Date;

  @ApiProperty({ example: '2026-03-01T00:00:00.000Z', format: 'date-time' })
  @IsDateString()
  endDate: Date;
}
