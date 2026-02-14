import { Module } from '@nestjs/common';
import { SearchProductService } from './search-product.service';
import { SearchProductController } from './search-product.controller';

@Module({
  providers: [SearchProductService],
  controllers: [SearchProductController],
})
export class SearchProductModule {}
