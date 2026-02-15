import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
@Global() // Declare the module as global
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
