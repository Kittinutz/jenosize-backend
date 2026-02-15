import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    await this.prisma.product.create({
      data: {
        title: createProductDto.title,
        price: Number(createProductDto.price),
        image_url: createProductDto.imageUrl,
        MarketPlaceProduct: {
          create: createProductDto.marketProduct?.map((mp) => ({
            platform: mp.platform,
            title: mp.title,
            price: Number(mp.price),
            image_url: mp.image_url,
            url: mp.url,
          })),
        },
      },
    });
    return 'This action adds a new product';
  }

  async findAll(): Promise<Product[]> {
    return await this.prisma.product.findMany({
      include: {
        MarketPlaceProduct: true,
      },
    });
  }

  async findOne(id: number | string): Promise<Product | null> {
    return await this.prisma.product.findUnique({
      where: { id: String(id) },
      include: {
        MarketPlaceProduct: true,
      },
    });
  }

  update(id: number | string, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number | string) {
    return `This action removes a #${id} product`;
  }
}
