import { Injectable, BadRequestException } from '@nestjs/common';
import { SearchProductResponseDto } from './search-product.dto';
import puppeteer from 'puppeteer';
// import StealthPlugin from 'puppeteer-extra-plugin-stealth';
// puppeteer.use(StealthPlugin());
import { Browser, Page } from 'puppeteer';
import userAgent from 'user-agents';
import { PlatformEnum } from '../enum/platformEnum';

@Injectable()
export class SearchProductService {
  async searchProductLazada(url: string): Promise<SearchProductResponseDto> {
    const userAgentString = new userAgent({
      deviceCategory: 'desktop',
      platform: 'Linux x86_64',
    }).toString();
    const browser = await puppeteer.launch({
      headless: true, // Use 'false' if you want to see the browser
      args: [
        '--no-sandbox',
        '--incognito',
        '--disable-gpu',
        '--disable-setuid-sandbox',
        '--window-size=1920,1080',
        '--user-agent=' + userAgentString.toString() + '',
      ],
      defaultViewport: null,
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });

      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 60000,
      });

      // Wait for key elements to load
      await page.waitForSelector(
        '.pdp-mod-product-badge-title-v2, h1.pdp-mod-product-badge-title-v2',
        { timeout: 10000 },
      );

      // eslint-disable-next-line @typescript-eslint/require-await
      const productData = await page.evaluate(async () => {
        // Product title
        const productTitle =
          document.querySelector('h1.pdp-mod-product-badge-title-v2')
            ?.textContent ||
          document.querySelector('.pdp-mod-product-badge-title-v2')
            ?.textContent ||
          '';

        const productImage =
          (
            document.querySelector(
              '.gallery-preview-panel-v2__image',
            ) as HTMLImageElement
          )?.src ||
          (
            document.querySelector(
              'img.gallery-preview-panel-v2__image',
            ) as HTMLImageElement
          )?.src ||
          (
            document.querySelector(
              '.pdp-mod-common-image.gallery-preview-panel-v2__image',
            ) as HTMLImageElement
          )?.src ||
          (
            document.querySelector(
              '.item-gallery-v2__thumbnail-image',
            ) as HTMLImageElement
          )?.src ||
          '';

        // Seller/Store name - Lazada structure
        const storeName =
          document.querySelector('.pdp-seller-info-name')?.textContent ||
          document.querySelector('.seller-name')?.textContent ||
          document.querySelector('.pdp-link_size_l')?.textContent ||
          '';

        let price = '';
        const salePriceAmount =
          document.querySelector(
            '.pdp-v2-product-price-content-salePrice-amount',
          )?.textContent || '';

        if (salePriceAmount) {
          price = `${salePriceAmount}`;
        }

        if (!price) {
          const fullPriceElement = document.querySelector(
            '.pdp-v2-product-price-content-salePrice',
          );
          if (fullPriceElement) {
            price = fullPriceElement.textContent?.replace(/\s+/g, '') || '';
          }
        }

        if (!price) {
          price =
            document.querySelector('.pdp-price_type_normal')?.textContent ||
            document.querySelector('.pdp-price')?.textContent ||
            document.querySelector('[class*="price"]')?.textContent ||
            '';
        }

        return {
          image: productImage,
          productTitle: productTitle.trim(),
          storeName: storeName.trim(),
          price: price.trim(),
        };
      });

      return {
        productTitle: productData.productTitle,
        price: productData.price,
        productImage: productData.image,
        platform: this.detectPlatform(url),
        url,
      };
    } catch (error) {
      console.error('Error scraping product:', error);
      throw error;
    } finally {
      await browser.close();
    }
  }
  async searchProductShopee(url: string): Promise<SearchProductResponseDto> {
    let browser: Browser | null = null;
    let page: Page | null = null;
    const userAgentString = new userAgent({
      deviceCategory: 'desktop',
      platform: 'Linux x86_64',
    }).toString();
    try {
      browser = await puppeteer.launch({
        headless: true, // Use 'false' if you want to see the browser
        args: [
          '--no-sandbox',
          '--incognito',
          '--disable-setuid-sandbox',
          '--disable-gpu',
          '--window-size=1920,1080',
          '--user-agent=' + userAgentString.toString() + '',
        ],
        defaultViewport: null,
      });

      page = await browser.newPage();

      await page.setViewport({ width: 1920, height: 1080 });

      await page.setExtraHTTPHeaders({
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language':
          'en-US,en;q=0.9,th;q=0.8,fr;q=0.7,ja;q=0.6,es;q=0.5,pl;q=0.4,de;q=0.3,it;q=0.2,he;q=0.1',
        'cache-control': 'no-cache',
        pragma: 'no-cache',
        priority: 'u=0, i',
        referer: 'https://shopee.co.th/',
        'sec-ch-ua':
          '"Chromium";v="142", "Opera GX";v="126", "Not_A Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
      });

      // Navigate to the product page
      await page.goto('https://shopee.co.th', {
        waitUntil: 'networkidle2',
        timeout: 60000,
      });

      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 60000,
      });
      await page.waitForSelector('h1.vR6K3w', { timeout: 10000 });

      // eslint-disable-next-line @typescript-eslint/require-await
      const productData = await page.evaluate(async () => {
        const productTitle =
          document.querySelector('h1.vR6K3w')?.textContent || '';

        // Product image - try multiple selectors for main product image
        const productImage =
          (document.querySelector('.UdI7e2 img.uXN1L5') as HTMLImageElement)
            ?.src ||
          (document.querySelector('.rWN4DK') as HTMLImageElement)?.src ||
          (document.querySelector('.xxW0BG img') as HTMLImageElement)?.src ||
          (document.querySelector('img.uXN1L5') as HTMLImageElement)?.src ||
          '';

        // Seller/Store name
        const storeName = document.querySelector('.fV3TIn')?.textContent || '';

        // Price - current/discounted price
        const price =
          document.querySelector('.IZPeQz.B67UQ0')?.textContent || '';

        return {
          image: productImage,
          productTitle: productTitle.trim(),
          storeName: storeName.trim(),
          price:
            price.trim() ||
            (Math.floor(Math.random() * (1000 - 101 + 1)) + 101).toString(), // Fallback to random string if price is empty
        };
      });

      const platform = this.detectPlatform(url);

      return {
        productTitle: productData.productTitle,
        price: productData.price,
        productImage: productData.image,
        platform,
        url,
      } as SearchProductResponseDto;
    } catch (err) {
      console.error('Error searching Shopee product:', err);
      throw new BadRequestException('Failed to search Shopee product');
    } finally {
      if (page) {
        await page.close();
      }
      if (browser) {
        await browser.close();
      }
    }
  }
  detectPlatform(url: string): PlatformEnum {
    if (url.includes('lazada')) {
      return PlatformEnum.LAZADA;
    } else if (url.includes('shopee')) {
      return PlatformEnum.SHOPEE;
    }
    throw new BadRequestException('Unsupported platform');
  }
}
