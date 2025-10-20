import cloudinary from "../config/cloudinary.config";
import stream from "stream";
import { AppError } from "../exeptions/app-error";
import { ErrorCode } from "../exeptions/error-status";

//? /////////////////////////////////////////////////////
//?
//? from ChatGPT with Love ❤️
//? Các service khác cần lưu ảnh thì gọi đến service này
//?
//? /////////////////////////////////////////////////////

/**
 * Upload ảnh lên Cloudinary
 * @param fileBuffer Buffer, lấy từ req.file.buffer
 * @param public_id Tên cơ sở dữ liệu sẽ lưu trên Cloudinary, ví dụ image_1
 * @param folder Tên thư mục sẽ lưu trên Cloudinary (mặc định 'uploads')
 * @returns Promise<{ url: string; public_id: string }>
 */
export const uploadFile = async (fileBuffer: Buffer, public_id: string, folder: string = "uploads") => {
  return new Promise<{ url: string; public_id: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, 
        resource_type: "auto",
        public_id: public_id 
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileBuffer);
    bufferStream.pipe(uploadStream);
  });
}

/**
 * Xóa ảnh theo public_id
 * @param imageUrl URL hình anh (VD: 'https://res.cloudinary.com/...') 
 * @returns Promise<void>
 */
export const deleteFile = async (fileUrl: string) : Promise<void> => {
  const publicId : string = getPublicIdFromUrl(fileUrl);
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new AppError(ErrorCode.BAD_REQUEST,`❌ Failed to delete image (${publicId})`);
  }
}

// /**
//  * Update ảnh: xóa ảnh cũ (nếu có), rồi upload ảnh mới
//  * @param fileBuffer Buffer file mới
//  * @param oldPublicId public_id ảnh cũ (nếu có)
//  * @param folder Folder Cloudinary
//  */
// export const updateImage = async (
//   fileBuffer: Buffer,
//   oldPublicId?: string,
//   folder: string = "uploads"
// ) => {
//   // Xóa ảnh cũ nếu có
//   if (oldPublicId) {
//     try {
//       await cloudinary.uploader.destroy(oldPublicId);
//     } catch (error) {
//       console.warn(`⚠️ Failed to delete old image (${oldPublicId}):`, error);
//     }
//   }

//   //  Upload ảnh mới
//   return await uploadImage(fileBuffer, folder);
// }

const getPublicIdFromUrl = (url: string) => {
  const parts = url.split("/");
  return parts[parts.length - 1].split(".")[0];
};
