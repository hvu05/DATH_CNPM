import { NextFunction, Request, Response } from 'express';
import { uploadFile, deleteFile } from '../services/cloudinary.service';
import * as uploadDto from '../dtos/upload';
import { ApiResponse } from '../types/api-response';
import { OrderReturnRequestSchema } from '../dtos/orders';

export const uploadImageHandler = async (
  req: Request,
  res: Response<ApiResponse<uploadDto.UploadResponse>>,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
    }

    // Parse optional folder from query or body
    const parsed = uploadDto.uploadImageSchema.safeParse(req.body);
    const folder =
      parsed.success && parsed.data ? parsed.data.folder : 'uploads';

    // Generate unique public_id
    const publicId = `image_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const result = await uploadFile(req.file.buffer, publicId, folder);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteImageHandler = async (
  req: Request,
  res: Response<ApiResponse<uploadDto.DeleteResponse>>,
  next: NextFunction,
) => {
  const parsed = uploadDto.deleteImageSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: parsed.error.issues[0].message,
    });
  }

  const { imageUrl } = parsed.data;

  try {
    await deleteFile(imageUrl);

    res.json({
      success: true,
      data: {
        message: 'Image deleted successfully',
      },
    });
  } catch (error) {
    next(error);
  }
};

export const uploadMultipleImageHandler = async (
  req: Request,
  res: Response<ApiResponse<uploadDto.UploadResponse[]>>,
  next: NextFunction,
) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
    }

    // Parse optional folder from query or body
    const parsed = uploadDto.uploadImageSchema.safeParse(req.body);
    const folder =
      parsed.success && parsed.data ? parsed.data.folder : 'uploads';

    const files = req.files as Express.Multer.File[];

    // Upload all files in parallel
    const uploadPromises = files.map((file, idx) => {
      const publicId = `image_${Date.now()}_${Math.random().toString(36).substring(2, 9)}_${idx}`;
      return uploadFile(file.buffer, publicId, folder);
    });

    const results = await Promise.all(uploadPromises);

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};


//? For test only
export const testHandler = async (req: Request, res: Response, next: NextFunction) => {
  const parsed = OrderReturnRequestSchema.safeParse({
    ...req.body,
    images: (req.files ?? []) as Express.Multer.File[]
  });

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: parsed.error.issues[0].message
    })
  }
  console.log("parsed data",parsed.data);
  try {
    res.json("sdsd");
  } catch (error) {
    next(error);
  }
}
