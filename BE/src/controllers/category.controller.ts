import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types/api-response";
import { CategoryCreateSchema, CategoryCreateRequest } from "../dtos/category/category-create.request";
import { categoryService } from "../services/category.service";
import { AppError } from "../exeptions";
import { ErrorCode } from "../exeptions/error-status";
import { CategoryResponse, CategoryResponseSchema, CategoryList, CategoryListSchema } from "../dtos/category/category.response";

// POST /categories
export const createCategoryHandler = async (
  req: Request,
  res: Response<ApiResponse<CategoryResponse>>,
  next: NextFunction
) => {
  try {
    const parsed = CategoryCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(ErrorCode.BAD_REQUEST, parsed.error.issues[0].message);
    }

    const data: CategoryCreateRequest = parsed.data;
    const category = await categoryService.createCategory(data);

    // Validate output trước khi trả về


    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// GET /categories
export const getAllCategoriesHandler = async (
  req: Request,
  res: Response<ApiResponse<CategoryList>>,
  next: NextFunction
) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

    // Lấy dữ liệu từ service
    const categories = await categoryService.getAllCategories(limit, offset);
    const responseData = CategoryListSchema.parse(categories);

    // Trả trực tiếp mà không parse
    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: responseData, // { count, results } hợp type rồi
    });
  } catch (error) {
    next(error);
  }
};