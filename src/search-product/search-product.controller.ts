import {
  BadRequestException,
  Controller,
  Get,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SearchProductService } from './search-product.service';
import {
  SearchProductDto,
  SearchProductResponseDto,
} from './search-product.dto';

@ApiTags('Search Product')
@Controller('search-product')
export class SearchProductController {
  constructor(private readonly searchProductService: SearchProductService) {}

  @Get()
  @ApiOperation({
    summary: 'Search product by URL',
    description:
      'Search and extract product information from Lazada or Shopee URL',
  })
  @ApiQuery({
    name: 'url',
    description: 'Product URL from Lazada or Shopee',
    required: true,
    example:
      'https://www.lazada.co.th/products/example-product-i123456789.html',
  })
  @ApiResponse({
    status: 200,
    description: 'Product information retrieved successfully',
    type: SearchProductResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid URL or validation error',
  })
  searchProduct(
    @Query(new ValidationPipe({ transform: true })) query: SearchProductDto,
  ): SearchProductResponseDto {
    const url = query.url;
    const platform = this.searchProductService.detectPlatform(url);
    if (!platform) {
      throw new BadRequestException('Unsupported platform');
    }
    const mappingexecuttion: { [key: string]: () => SearchProductResponseDto } =
      {
        lazada: () => this.searchProductService.searchProduct(url),
        shopee: () => this.searchProductService.searchProductShopee(url),
      };

    return mappingexecuttion[platform]();
  }
}
