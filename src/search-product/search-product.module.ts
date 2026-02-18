import { Module } from '@nestjs/common';
import { SearchProductService } from './search-product.service';
import { SearchProductController } from './search-product.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 2592000, // 30 days default
    }),
  ],
  providers: [SearchProductService],
  controllers: [SearchProductController],
})
export class SearchProductModule {}
