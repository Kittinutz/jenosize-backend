import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchProductModule } from './search-product/search-product.module';
import { ProductModule } from './product/product.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CampaignModule } from './campaign/campaign.module';
import { GoModule } from './go/go.module';
import { BullModule } from '@nestjs/bullmq';
import { ClickEventsModule } from './click-events/click-events.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
        },
        defaultJobOptions: {
          removeOnComplete: true, // don't pile up completed jobs
          removeOnFail: 100, // keep last 100 failed for debugging
          attempts: 3, // retry 3 times if consumer crashes
          backoff: {
            type: 'exponential',
            delay: 1000, // 1s, 2s, 4s
          },
        },
      }),
      inject: [ConfigService],
    }),

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SearchProductModule,
    ProductModule,
    PrismaModule,
    CampaignModule,
    GoModule,
    ClickEventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
