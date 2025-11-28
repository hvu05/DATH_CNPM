import * as adminDto from '../../dtos/admin';
import * as adminService from '../../services/admin/products.service';
import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../../dtos/common/api-response';
import { productService } from '../../services/product.service';

// Admin Product APIs - Hades
export const getAllProductsHandler = async (
  req: Request,
  res: Response<ApiResponse<adminDto.ProductListResponse>>,
  next: NextFunction,
) => {
  const parsed = adminDto.ProductListQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: parsed.error.issues[0].message,
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
      search: queryData.search,
    });

    const response: ApiResponse<adminDto.ProductListResponse> = {
      success: true,
      data: productsList,
    };
    res.status(200).json(response);
  } catch (error: Error | any) {
    next(error);
  }
};

export const getAllCategories = async (
  req: Request,
  res: Response<ApiResponse<adminDto.CategoriesListResponse>>,
  next: NextFunction,
) => {
  const parsed = adminDto.CategoriesQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: parsed.error.issues[0].message,
    });
  }

  const queryData = parsed.data;
  try {
    const categoriesList =
      await adminService.getAllProductsCategories(queryData);
    const response = {
      success: true,
      data: categoriesList,
    } as ApiResponse<adminDto.CategoriesListResponse>;
    return res.status(200).json(response);
  } catch (error: Error | any) {
    next(error);
  }
};

export const getBrands = async (
  req: Request,
  res: Response<ApiResponse<adminDto.BrandsListResponse>>,
  next: NextFunction,
) => {
  try {
    const brands = await adminService.getAllBrands();
    const response = {
      success: true,
      data: brands,
    } as ApiResponse<adminDto.BrandsListResponse>;
    return res.status(200).json(response);
  } catch (error: Error | any) {
    next(error);
  }
};

export const getSeries = async (
  req: Request,
  res: Response<ApiResponse<adminDto.SeriesListRes>>,
  next: NextFunction,
) => {
  try {
    const series = await adminService.getAllSeries();
    const response = {
      success: true,
      data: series,
    } as ApiResponse<adminDto.SeriesListRes>;
    return res.status(200).json(response);
  } catch (error: Error | any) {
    next(error);
  }
};

export const createNewProduct = async (
  req: Request,
  res: Response<ApiResponse<adminDto.IAddNewProductResponse>>,
  next: NextFunction,
) => {
  try {
    // Parse request body with schema validation
    const parsed = adminDto.NewProductsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: parsed.error.issues.map((i) => i.message).join(', '),
      });
    }

    const data = parsed.data;

    // Process uploaded images
    const uploadedFiles = req.files as Express.Multer.File[] | undefined;
    const images = uploadedFiles?.map((file, index) => ({
      buffer: file.buffer,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      // First image is thumbnail by default, or check if marked in request
      is_thumbnail: index === 0,
    }));

    // Calculate total quantity from variants
    const totalQuantity = data.variants.reduce((sum, v) => sum + v.quantity, 0);

    // Build full product create request
    const productData = {
      name: data.name,
      description: data.description,
      quantity: totalQuantity,
      brand_id: data.brand_id,
      series_id: data.series_id,
      category_id: data.category_id,
      is_active: data.is_active,
      images: images,
      variants: data.variants.map((v) => ({
        ...v,
        export_price: v.price, // export_price = selling price
      })),
      specifications: data.specifications,
    };

    // Use productService.createProduct for full functionality
    const newProduct = await productService.createProduct(productData as any);

    const response: ApiResponse<adminDto.IAddNewProductResponse> = {
      success: true,
      message: 'Product created successfully',
      data: {
        id: newProduct.id,
        name: newProduct.name,
        description: newProduct.description,
        quantity: newProduct.quantity,
        brand_id: newProduct.brand_id,
        series_id: newProduct.series_id,
        category_id: newProduct.category_id,
        is_active: newProduct.is_active,
        create_at: newProduct.create_at,
        update_at: newProduct.update_at,
      },
    };
    return res.status(201).json(response);
  } catch (error: Error | any) {
    next(error);
  }
};

/**
 * Update product is_active status
 * PATCH /admin/products/:id/status
 */
export const updateProductStatus = async (
  req: Request,
  res: Response<ApiResponse<{ id: number; is_active: boolean }>>,
  next: NextFunction,
) => {
  try {
    const productId = parseInt(req.params.id, 10);
    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID',
      });
    }

    const { is_active } = req.body;
    if (typeof is_active !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'is_active must be a boolean',
      });
    }

    const updatedProduct = await adminService.updateProductStatus(
      productId,
      is_active,
    );

    return res.status(200).json({
      success: true,
      message: is_active
        ? 'Product published successfully'
        : 'Product unpublished successfully',
      data: {
        id: updatedProduct.id,
        is_active: updatedProduct.is_active,
      },
    });
  } catch (error: Error | any) {
    next(error);
  }
};
