import { Injectable, BadRequestException } from '@nestjs/common';
import { SearchProductResponseDto } from './search-product.dto';

@Injectable()
export class SearchProductService {
  searchProduct(url: string): SearchProductResponseDto {
    // Determine platform
    const platform = this.detectPlatform(url);

    // Extract product ID
    const productId = this.extractProductId(url, platform);

    // Mock product name extraction (in real scenario, you'd scrape or use API)

    return {
      productTitle: `Mock Product Title for ID ${productId}`,
      price: '999.99',
      productImage: 'https://example.com/product-image.jpg',
      platform,
      url,
    };
  }
  searchProductShopee(url: string): SearchProductResponseDto {
    // Determine platform
    const platform = this.detectPlatform(url);

    // Extract product ID
    const productId = this.extractProductId(url, platform);

    // Mock product name extraction (in real scenario, you'd scrape or use API)

    return {
      productTitle: `Mock Shopee Product Title for ID ${productId}`,
      price: '899.99',
      productImage: 'https://example.com/shopee-product-image.jpg',
      platform,
      url,
    };
  }
  detectPlatform(url: string): string {
    if (url.includes('lazada')) {
      return 'lazada';
    } else if (url.includes('shopee')) {
      return 'shopee';
    }
    throw new BadRequestException('Unsupported platform');
  }

  extractProductId(url: string, platform: string): string {
    try {
      if (platform === 'lazada') {
        // Lazada URL pattern: https://www.lazada.co.th/products/product-name-i123456789.html
        const match = url.match(/-i(\d+)\.html/);
        if (match && match[1]) {
          return match[1];
        }
      } else if (platform === 'shopee') {
        // Shopee URL pattern: https://shopee.co.th/product-name-i.123.456789
        const match = url.match(/\.i\.(\d+)\.(\d+)/);
        if (match && match[2]) {
          return match[2];
        }
        // Alternative pattern: https://shopee.co.th/product-i.123456789
        const altMatch = url.match(/\.i\.(\d+)/);
        if (altMatch && altMatch[1]) {
          return altMatch[1];
        }
      }
      return 'unknown';
    } catch (error) {
      return 'unknown';
    }
  }
}
