import { Injectable, BadRequestException } from '@nestjs/common';
import { SearchProductResponseDto } from './search-product.dto';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());
import { Browser, Page } from 'puppeteer';
import fs from 'fs';
import userAgent from 'user-agents';
import { PlatformEnum } from 'src/enum/platformEnum';
@Injectable()
export class SearchProductService {
  async searchProductLazada(url: string): Promise<SearchProductResponseDto> {
    const browser = await puppeteer.launch({
      headless: true, // Use 'false' if you want to see the browser
      args: [
        '--no-sandbox',
        '--incognito',
        '--disable-setuid-sandbox',
        '--window-size=1920,1080',
      ],
    });

    try {
      const page = await browser.newPage();

      // Set user agent to match the browser
      const userAgentString = new userAgent().toString();
      await page.setUserAgent(userAgentString, userAgent.data);

      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 60000,
      });

      // Wait for key elements to load
      await page.waitForSelector(
        '.pdp-mod-product-badge-title-v2, h1.pdp-mod-product-badge-title-v2',
        { timeout: 10000 },
      );

      // Extract product information
      const productData = await page.evaluate(async () => {
        // Product title
        const productTitle =
          document.querySelector('h1.pdp-mod-product-badge-title-v2')
            ?.textContent ||
          document.querySelector('.pdp-mod-product-badge-title-v2')
            ?.textContent ||
          '';

        // Product image - main product image from gallery
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

        // Price - current/discounted price (sale price) with multiple fallback options
        let price = '';

        // Try method 1: Separate sign and amount
        const salePriceAmount =
          document.querySelector(
            '.pdp-v2-product-price-content-salePrice-amount',
          )?.textContent || '';

        if (salePriceAmount) {
          price = `${salePriceAmount}`;
        }

        // Try method 2: Get full price container
        if (!price) {
          const fullPriceElement = document.querySelector(
            '.pdp-v2-product-price-content-salePrice',
          );
          if (fullPriceElement) {
            price = fullPriceElement.textContent?.replace(/\s+/g, '') || '';
          }
        }

        // Try method 3: Alternative price selectors
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

    try {
      browser = await puppeteer.launch({
        headless: true, // Use 'false' if you want to see the browser
        args: [
          '--no-sandbox',
          '--incognito',
          '--disable-setuid-sandbox',
          '--window-size=1920,1080',
          //   '--disable-web-security',
        ],
        defaultViewport: {
          width: 1920,
          height: 1080,
        },
      });

      page = await browser.newPage();
      const userAgentString = new userAgent().toString();
      await page.setUserAgent(userAgentString, userAgent.data);

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
      const cookies = fs.readFileSync(
        './credentials/shopee-cookies.json',
        'utf-8',
      );
      const sessionStorage = JSON.parse(
        fs.readFileSync('./credentials/shopee-session-storage.json', 'utf-8'),
      );
      const localStorage = JSON.parse(
        fs.readFileSync('./credentials/shopee-local-storage.json', 'utf-8'),
      );

      // Navigate to the product page
      await page.goto('https://shopee.co.th', {
        waitUntil: 'networkidle2',
        timeout: 60000,
      });
      const cookiesArray = JSON.parse(cookies);
      await page.setCookie(...cookiesArray);
      await page.evaluate(
        async ({
          sessionStorage: sessionStorageData,
          localStorage: localStorageData,
        }) => {
          for (const key in sessionStorageData) {
            await sessionStorage.setItem(key, sessionStorageData[key]);
          }
          for (const key in localStorageData) {
            await localStorage.setItem(key, localStorageData[key]);
          }
          // Simulate user interaction to trigger any lazy loading or dynamic content
        },
        {
          sessionStorage,
          localStorage,
        },
      );

      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 60000,
      });
      await page.waitForSelector('h1.vR6K3w', { timeout: 10000 });

      const productData = await page.evaluate(async () => {
        // Product title

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

  extractProductId(url: string, platform: PlatformEnum): string {
    try {
      if (platform === PlatformEnum.LAZADA) {
        // Lazada URL pattern: https://www.lazada.co.th/products/product-name-i123456789.html
        const match = url.match(/-i(\d+)\.html/);
        if (match && match[1]) {
          return match[1];
        }
      } else if (platform === PlatformEnum.SHOPEE) {
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
    } catch {
      return 'unknown';
    }
  }
}
