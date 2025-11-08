import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types/api-response";
import { CategoryCreateSchema, CategoryCreateRequest } from "../dtos/category/category-create.request";
import { categoryService } from "../services/category.service";
import { AppError } from "../exeptions";
import { ErrorCode } from "../exeptions/error-status";

// POST /categories
export const createCategoryHandler = async (
  req: Request,
  res: Response<ApiResponse<any>>,
  next: NextFunction
) => {
  try {
    const parsed = CategoryCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(ErrorCode.BAD_REQUEST, parsed.error.issues[0].message);
    }

    const data: CategoryCreateRequest = parsed.data;
    const category = await categoryService.createCategory(data);

    const response: ApiResponse<typeof category> = {
      success: true,
      message: "Category created successfully",
      data: category,
    };

    return res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

// ✅ GET /categories
export const getAllCategoriesHandler = async (
  req: Request,
  res: Response<ApiResponse<any>>,
  next: NextFunction
) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

    const data = await categoryService.getAllCategories(limit, offset);

    const response: ApiResponse<typeof data> = {
      success: true,
      message: "Categories fetched successfully",
      data,
    };

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
