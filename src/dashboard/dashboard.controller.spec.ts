import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('DashboardController', () => {
  let controller: DashboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        DashboardService,
        {
          provide: PrismaService,
          useValue: {
            clickEvent: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
