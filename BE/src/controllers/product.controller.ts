import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types/api-response";
import { AppError } from "../exeptions";
import { ErrorCode } from "../exeptions/error-status";
import { productService } from "../services/product.service";
import {
  ProductCreateSchema,
  ProductCreateRequest,
} from "../dtos/product/product-create.request";
import {
  ProductUpdateSchema,
  ProductUpdateRequest,
} from "../dtos/product/product-update.request";
import {
  ProductResponseSchema,
  ProductResponse,
} from "../dtos/product/product.response";

import { uploadFile } from "../services/cloudinary.service";
import { ProductListResponse } from "../dtos/product/product-list.response";

// ------------------- CREATE PRODUCT -------------------
export const createProductHandler = async (
  req: Request,
  res: Response<ApiResponse<ProductResponse>>,
  next: NextFunction
) => {
  try {
    const parsed = ProductCreateSchema.safeParse({
      ...req.body,
      images: (req.files ?? []) as Express.Multer.File[],
  });
    if (!parsed.success) {
      throw new AppError(ErrorCode.BAD_REQUEST, parsed.error.issues[0].message);
    }

    const data: ProductCreateRequest = parsed.data;
    const product = await productService.createProduct(data);

    // Validate bằng Zod
    // const validated = ProductResponseSchema.parse(product);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// ------------------- UPDATE PRODUCT -------------------
export const updateProductHandler = async (
  req: Request,
  res: Response<ApiResponse<ProductResponse>>,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const parsed = ProductUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(ErrorCode.BAD_REQUEST, parsed.error.issues[0].message);
    }

    const data: ProductUpdateRequest = parsed.data;
    const updated = await productService.updateProduct(id, data);

    const validated = ProductResponseSchema.parse(updated);

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: validated,
    });
  } catch (error) {
    next(error);
  }
};

// ------------------- DELETE PRODUCT -------------------
export const deleteProductHandler = async (
  req: Request,
  res: Response<ApiResponse<null>>,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    await productService.deleteProduct(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// ------------------- GET SINGLE PRODUCT -------------------
export const getProductHandler = async (
  req: Request,
  res: Response<ApiResponse<ProductResponse>>,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id))
      throw new AppError(ErrorCode.BAD_REQUEST, "Invalid product id");

    const product = await productService.getProductById(id);

    if (!product) throw new AppError(ErrorCode.NOT_FOUND, "Product not found");

    // const validated = ProductResponseSchema.parse(product);

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: {
        ...product,
        rate: {
          avg: product.reviews.reduce(
            (acc, review) => acc + review.vote,
            0
          ) / product.reviews.length,
          count: product.reviews.length,
        }
      },
    });
  } catch (error) {
    next(error);
  }
};

// ------------------- GET ALL PRODUCTS -------------------
export const getAllProductsHandler = async (
  req: Request,
  res: Response<ApiResponse<ProductListResponse>>,
  next: NextFunction
) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const offset = (page - 1) * limit;

    const filters: any = {};
    if (req.query.search)
      filters.name = { contains: req.query.search as string, mode: "insensitive" };
    if (req.query.category_id)
      filters.category_id = parseInt(req.query.category_id as string);
    if (req.query.brand_id)
      filters.brand_id = parseInt(req.query.brand_id as string);
    if (req.query.series_id)
      filters.series_id = parseInt(req.query.series_id as string);
    if (req.query.is_active !== undefined)
      filters.is_active = req.query.is_active === "true";

    const sortBy = (req.query.sort_by as string) || "create_at";
    const order =
      (req.query.order as string)?.toLowerCase() === "desc" ? "desc" : "asc";

    const { products, total } = await productService.getAllProducts({
      filters,
      offset,
      limit,
      sortBy,
      order,
      includeThumbnail: true,
    });

    // Parse từng product
    // const validated = ProductResponseSchema.array().parse(products);

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: {
        page,
        limit,
        total_items: total,
        total_pages: Math.ceil(total / limit),
        results: products,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ------------------- UPLOAD PRODUCT IMAGE -------------------
export const uploadProductImageHandler = async (
  req: Request,
  res: Response<ApiResponse<any>>,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id))
      throw new AppError(ErrorCode.BAD_REQUEST, "Invalid product id");

    const file = req.file;
    if (!file) throw new AppError(ErrorCode.BAD_REQUEST, "No file uploaded");

    const is_thumbnail =
      req.body.is_thumbnail === "true" || req.body.is_thumbnail === true;

    const image = await productService.uploadProductImage(
      id,
      file,
      is_thumbnail
    );

    return res.status(200).json({
      success: true,
      message: "Product image uploaded successfully",
      data: image,
    });
  } catch (error) {
    next(error);
  }
};