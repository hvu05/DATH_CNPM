import { prisma } from "../config/prisma.config";
import { AppError } from "../exeptions";
import { ErrorCode } from "../exeptions/error-status";
import { CategoryCreateRequest } from "../dtos/category/category-create.request";

export const categoryService = {
  async createCategory(data: CategoryCreateRequest) {
    const existing = await prisma.category.findUnique({
      where: { name: data.name },
    });

    if (existing) {
      throw new AppError(
        ErrorCode.CONFLICT,
        `Category with name "${data.name}" already exists`
      );
    }

    const newCategory = await prisma.category.create({
      data: { name: data.name },
    });

    return {
      id: newCategory.id,
      name: newCategory.name,
      create_at: newCategory.create_at,
    };
  },

  // ✅ Lấy danh sách category (có phân trang)
  async getAllCategories(limit?: number, offset: number = 0) {
    const [results, count] = await Promise.all([
      prisma.category.findMany({
        skip: offset * (limit || 0),
        take: limit,
        select: { id: true, name: true },
        orderBy: { id: "asc" },
      }),
      prisma.category.count(),
    ]);

    return { count, results };
  },
};
