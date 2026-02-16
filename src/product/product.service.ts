import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    return await this.prisma.product.create({
      data: {
        title: createProductDto.title,
        price: Number(createProductDto.price),
        image_url: createProductDto.imageUrl,
        marketPlaceProducts: {
          create: createProductDto.marketProduct?.map((mp) => ({
            platform: mp.platform,
            title: mp.title,
            price: Number(mp.price),
            image_url: mp.image_url,
            url: mp.url,
          })),
        },
      },
      include: {
        marketPlaceProducts: true,
      },
    });
  }

  async findAll(): Promise<Product[]> {
    return await this.prisma.product.findMany({
      include: {
        marketPlaceProducts: true,
      },
    });
  }

  async findOne(id: number | string): Promise<Product | null> {
    return await this.prisma.product.findUnique({
      where: { id: String(id) },
      include: {
        marketPlaceProducts: true,
      },
    });
  }

  async update(id: number | string, updateProductDto: UpdateProductDto) {
    return await this.prisma.product.update({
      where: { id: String(id) },
      data: {
        title: updateProductDto.title,
        price: Number(updateProductDto.price),
        image_url: updateProductDto.imageUrl,
        marketPlaceProducts: {
          deleteMany: {}, // Delete existing marketplace products
          create: updateProductDto.marketProduct?.map((mp) => ({
            platform: mp.platform,
            title: mp.title,
            price: Number(mp.price),
            image_url: mp.image_url,
            url: mp.url,
          })),
        },
      },
    });
  }

  async remove(id: number | string) {
    return this.prisma.product.delete({
      where: { id: String(id) },
      include: {
        marketPlaceProducts: true,
      },
    });
  }
}
