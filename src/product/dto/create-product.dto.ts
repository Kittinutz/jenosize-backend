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
import { PlatformEnum } from '../../generated/prisma/enums';

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
    example: '999',
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
    example:
      'https://shopee.co.th/product/1633900525/41069319585?d_id=7f518&uls_trackid=54uj5j9n00qv&utm_content=48Wzj2x7zy8kPQybUJZF1TEcdWVd',
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
  @ApiProperty({
    type: [MarketPlaceProductDto],
    required: false,
    example: [
      {
        title: 'iPhone 15 Pro Max 256GB',
        price: '999',
        image_url:
          'https://down-th.img.susercontent.com/file/th-11134258-7r98z-lza9f5c8o71l63',
        url: 'https://shopee.co.th/Apple-iPhone-15-(เลือกความจุ-สีได้)-i.989284521.23454437584?extraParams=%7B"display_model_id"%3A147012207505%2C"model_selection_logic"%3A3%7D&sp_atk=9466294d-b8c2-45ed-8df1-02f863cd23b1&xptdk=9466294d-b8c2-45ed-8df1-02f863cd23b1',
        platform: PlatformEnum.LAZADA as string,
      },
      {
        title: 'iPhone 15 Pro Max 256GB',
        price: '999',
        image_url:
          'https://img.lazcdn.com/g/p/ebfbc9c4d4e228a1a77c7c90cbee4c2e.jpg_720x720q80.jpg_.webp',
        url: 'https://www.lazada.co.th/products/pdp-i4871507581-s20400818148.html?c=&channelLpJumpArgs=&clickTrackInfo=query%253Aiphone%252B15%252Bpro%252Bmax%253Bnid%253A4871507581%253Bsrc%253ALazadaMainSrp%253Brn%253A21ab2d9a22b69b7b01d99437dc06b56b%253Bregion%253Ath%253Bsku%253A4871507581_TH%253Bprice%253A19590%253Bclient%253Adesktop%253Bsupplier_id%253A1000001064%253Bsession_id%253A%253Bbiz_source%253Ah5_hp%253Bslot%253A1%253Butlog_bucket_id%253A470687%253Basc_category_id%253A3973%253Bitem_id%253A4871507581%253Bsku_id%253A20400818148%253Bshop_id%253A182839%253BtemplateInfo%253A-1_A3_C%2523155383_D_E_G%2523&freeshipping=1&fs_ab=2&fuse_fs=&lang=en&location=Chachoengsao&price=1.959E%204&priceCompare=skuId%3A20400818148%3Bsource%3Alazada-search-voucher%3Bsn%3A21ab2d9a22b69b7b01d99437dc06b56b%3BoriginPrice%3A1959000%3BdisplayPrice%3A1959000%3BsinglePromotionId%3A900000115257749%3BsingleToolCode%3AmillionSubsidy%3BvoucherPricePlugin%3A0%3Btimestamp%3A1771210449120&ratingscore=4.974025974025974&request_id=21ab2d9a22b69b7b01d99437dc06b56b&review=5621&sale=21044&search=1&source=search&spm=a2o4m.searchlist.list.1&stock=1',
        platform: PlatformEnum.SHOPEE as string,
      },
    ],
  })
  marketProduct?: MarketPlaceProductDto[];
}
