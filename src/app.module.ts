import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchProductModule } from './search-product/search-product.module';
import { ProductModule } from './product/product.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CampaignModule } from './campaign/campaign.module';
import { GoModule } from './go/go.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SearchProductModule,
    ProductModule,
    PrismaModule,
    CampaignModule,
    GoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
