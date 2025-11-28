import { prisma } from '../config/prisma.config';
import { AppError } from '../exeptions';
import { ErrorCode } from '../exeptions/error-status';
import {
  BrandCreateRequest,
  BrandUpdateRequest,
} from '../dtos/brand/brand-create.resquest';

export const brandService = {
  async createBrand(data: BrandCreateRequest) {
    const existing = await prisma.brand.findUnique({
      where: { name: data.name },
    });
    if (existing)
      throw new AppError(
        ErrorCode.CONFLICT,
        `Brand "${data.name}" already exists`,
      );

    const brand = await prisma.brand.create({ data });
    return brand;
  },

  async updateBrand(id: number | string, data: BrandUpdateRequest) {
    const brandId = typeof id === 'string' ? parseInt(id) : id;
    const existing = await prisma.brand.findUnique({ where: { id: brandId } });
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Brand not found');

    const updated = await prisma.brand.update({ where: { id: brandId }, data });
    return updated;
  },

  async deleteBrand(id: number | string) {
    const brandId = typeof id === 'string' ? parseInt(id) : id;
    const existing = await prisma.brand.findUnique({ where: { id: brandId } });
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Brand not found');

    await prisma.brand.delete({ where: { id: brandId } });
    return;
  },

  async getBrandById(id: number | string) {
    const brandId = typeof id === 'string' ? parseInt(id) : id;
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
      include: { category: true },
    });
    if (!brand) throw new AppError(ErrorCode.NOT_FOUND, 'Brand not found');
    return brand;
  },

  async getAllBrands(limit?: number, offset: number = 0) {
    const [results, count] = await Promise.all([
      prisma.brand.findMany({
        skip: offset * (limit || 0),
        take: limit,
        orderBy: { id: 'asc' },
        include: { category: true },
      }),
      prisma.brand.count(),
    ]);

    return { results, count };
  },
};

export const seriesService = {
  async createSeries(data: any) {
    const series = await prisma.series.create({ data });
    return series;
  },

  async getSeriesByBrand(brandName: string) {
    const series = await prisma.series.findMany({
      where: { brand: { name: brandName } },
    });
    return series;
  }
};
