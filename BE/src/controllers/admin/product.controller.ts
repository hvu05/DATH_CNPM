import * as adminDto from "../../dtos/admin";
import * as adminService from "../../services/admin/products.service";
import e, { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../types/api-response";

// Admin Product APIs - Hades
export const getAllProductsHandler = async (req: Request, res: Response<ApiResponse<adminDto.ProductListResponse>>, next: NextFunction) => {
    const parsed = adminDto.ProductListQuerySchema.safeParse(req.query);
    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            error: parsed.error.issues[0].message
        });
    }

    const queryData: adminDto.ProductListQueryRequest = parsed.data;

    try {
        const productsList = await adminService.getAllProducts({
            page: queryData.page,
            limit: queryData.limit,
            sortBy: queryData.sortBy,
            sortOrder: queryData.sortOrder,
            categoryId: queryData.categoryId,
            search: queryData.search
        });

        const response: ApiResponse<adminDto.ProductListResponse> = {
            success: true,
            data: productsList
        };
        res.status(200).json(response);
    }
    catch (error: Error | any) {
        next(error);
    }
}

export const getAllCategories = async (req: Request, res: Response<ApiResponse<adminDto.CategoriesListResponse>>, next: NextFunction) => {
    const parsed = adminDto.CategoriesQuerySchema.safeParse(req.query);
    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            error: parsed.error.issues[0].message
        })
    }

    const queryData = parsed.data;
    try {
        const categoriesList = await adminService.getAllProductsCategories(queryData);
        const response = {
            success: true,
            data: categoriesList
        } as ApiResponse<adminDto.CategoriesListResponse>;
        return res.status(200).json(response);
    } catch (error: Error | any) {
        next(error);
    }
}

export const getBrands = async (req: Request, res: Response<ApiResponse<adminDto.BrandsListResponse>>, next: NextFunction) => {
    try {
        const brands = await adminService.getAllBrands();
        const response = {
            success: true,
            data: brands
        } as ApiResponse<adminDto.BrandsListResponse>;
        return res.status(200).json(response);
    } catch (error: Error | any) {
        next(error);
    }
}

export const getSeries = async (req: Request, res: Response<ApiResponse<adminDto.SeriesListRes>>, next: NextFunction) => {
    try {
        const series = await adminService.getAllSeries();
        const response = {
            success: true,
            data: series
        } as ApiResponse<adminDto.SeriesListRes>;
        return res.status(200).json(response);
    } catch (error: Error | any) {
        next(error);
    }
}
export const createNewProduct = async (req: Request, res: Response<ApiResponse<adminDto.IAddNewProductResponse>>, next: NextFunction) => {
    try {
        const parsed = adminDto.NewProductsSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                error: parsed.error.issues[0].message
            })
        }
        const newProduct = await adminService.addNewProduct(parsed.data);
        const response = {
            success: true,
            data: newProduct,
        } as ApiResponse<adminDto.IAddNewProductResponse>;
        return res.status(200).json(response);
    } catch (error: Error | any) {
        next(error);
    }
}

