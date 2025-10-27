import { NextFunction, Request, Response } from 'express';
import { uploadFile, deleteFile } from '../services/cloudinary.service';
import * as uploadDto from '../dtos/upload';
import { ApiResponse } from '../types/api-response';

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
