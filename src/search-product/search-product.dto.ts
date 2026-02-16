import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, IsNotEmpty, Matches } from 'class-validator';

export class SearchProductDto {
  @ApiProperty({
    description: 'Product URL from Lazada or Shopee',
    example:
      'https://www.lazada.co.th/products/example-product-i123456789.html',
    required: true,
  })
  @IsNotEmpty({ message: 'URL is required' })
  @IsString({ message: 'URL must be a string' })
  @IsUrl({}, { message: 'Invalid URL format' })
  @Matches(
    /^https?:\/\/(www\.)?(lazada|shopee)\.(co\.th|com|sg|my|ph|vn|id|tw)\/.*$/,
    {
      message: 'URL must be from Lazada or Shopee',
    },
  )
  url: string;
}

export class SearchProductResponseDto {
  @ApiProperty({
    description: 'Product title extracted from the URL',
    example: 'iPhone 15 Pro Max 256GB',
  })
  productTitle: string;
  @ApiProperty({
    description: 'Product price extracted from the URL',
    example: '999.99',
  })
  price: string;

  @ApiProperty({
    description: 'Product image URL extracted from the URL',
    example: 'https://example.com/product-image.jpg',
  })
  productImage: string;

  @ApiProperty({
    description: 'Platform (lazada or shopee)',
    example: 'lazada',
  })
  platform: string;

  @ApiProperty({
    description: 'Original URL',
    example:
      'https://www.lazada.co.th/products/example-product-i123456789.html',
  })
  url: string;
}
