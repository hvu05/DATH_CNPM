import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types/api-response";
import { AppError } from "../exeptions";
import { ErrorCode } from "../exeptions/error-status";
import { brandService } from "../services/brand.service";
import { BrandCreateSchema, BrandUpdateSchema} from "../dtos/brand/brand.-create.resquest";
import { BrandResponseSchema, BrandResponse } from "../dtos/brand/brand.response";

// CREATE
export const createBrandHandler = async (req: Request, res: Response<ApiResponse<BrandResponse>>, next: NextFunction) => {
  try {
    const parsed = BrandCreateSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(ErrorCode.BAD_REQUEST, parsed.error.issues[0].message);

    const brand = await brandService.createBrand(parsed.data);
    const validated = BrandResponseSchema.parse(brand);

    return res.status(201).json({ success: true, message: "Brand created successfully", data: validated });
  } catch (error) {
    next(error);
  }
};

// UPDATE
export const updateBrandHandler = async (req: Request, res: Response<ApiResponse<BrandResponse>>, next: NextFunction) => {
  try {
    const id = req.params.id;
    const parsed = BrandUpdateSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(ErrorCode.BAD_REQUEST, parsed.error.issues[0].message);

    const updated = await brandService.updateBrand(id, parsed.data);
    const validated = BrandResponseSchema.parse(updated);

    return res.status(200).json({ success: true, message: "Brand updated successfully", data: validated });
  } catch (error) {
    next(error);
  }
};

// DELETE
export const deleteBrandHandler = async (req: Request, res: Response<ApiResponse<null>>, next: NextFunction) => {
  try {
    const id = req.params.id;
    await brandService.deleteBrand(id);

    return res.status(200).json({ success: true, message: "Brand deleted successfully", data: null });
  } catch (error) {
    next(error);
  }
};

// GET SINGLE
export const getBrandHandler = async (req: Request, res: Response<ApiResponse<BrandResponse>>, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw new AppError(ErrorCode.BAD_REQUEST, "Invalid brand id");

    const brand = await brandService.getBrandById(id);
    const validated = BrandResponseSchema.parse(brand);

    return res.status(200).json({ success: true, message: "Brand fetched successfully", data: validated });
  } catch (error) {
    next(error);
  }
};

// GET ALL
export const getAllBrandsHandler = async (req: Request, res: Response<ApiResponse<BrandResponse[]>>, next: NextFunction) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

    const { results } = await brandService.getAllBrands(limit, offset);
    const validated = BrandResponseSchema.array().parse(results);

    return res.status(200).json({ success: true, message: "Brands fetched successfully", data: validated });
  } catch (error) {
    next(error);
  }
};
