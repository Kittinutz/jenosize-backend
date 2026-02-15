import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsUrl,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PlatformEnum } from 'src/generated/prisma/enums';

export class MarketPlaceProductDto {
  @ApiProperty({
    description: 'Product title from marketplace',
    example: 'iPhone 15 Pro Max 256GB',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Product price',
    example: '45990',
  })
  @IsString()
  @IsNotEmpty()
  price: string;

  @ApiProperty({
    description: 'Product image URL',
    example: 'https://example.com/image.jpg',
  })
  @IsUrl()
  @IsNotEmpty()
  image_url: string;

  @ApiProperty({
    description: 'Product URL from marketplace',
    example: 'https://www.lazada.co.th/products/iphone-15-pro-i123456.html',
  })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    description: 'Marketplace platform (lazada or shopee)',
    example: PlatformEnum.LAZADA as string,
    enum: [PlatformEnum.LAZADA, PlatformEnum.SHOPEE],
  })
  @IsString()
  @IsNotEmpty()
  platform: PlatformEnum;
}

export class CreateProductDto {
  @ApiProperty({
    description: 'Product title',
    example: 'iPhone 15 Pro Max 256GB',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Product price',
    example: '45990',
  })
  @IsString()
  @IsNotEmpty()
  price: string;

  @ApiProperty({
    description: 'Product image URL',
    example: 'https://example.com/image.jpg',
  })
  @IsUrl()
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty({
    description: 'Array of marketplace products',
    type: [MarketPlaceProductDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MarketPlaceProductDto)
  @IsOptional()
  marketProduct?: MarketPlaceProductDto[];
}
