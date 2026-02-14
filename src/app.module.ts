import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchProductModule } from './search-product/search-product.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [SearchProductModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
