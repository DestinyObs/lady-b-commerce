import { Request, Response, NextFunction } from 'express';
import { uploadImage, deleteImage, CLOUDINARY_FOLDERS } from '../config/cloudinary';
import { sendSuccess, sendCreated, sendError } from '../utils/response';

export async function uploadSingleImage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) { sendError(res, 'No file provided', 400); return; }
    const folder = (req.query.folder as string) || CLOUDINARY_FOLDERS.CONTENT;
    const result = await uploadImage(req.file.buffer, folder);
    sendCreated(res, result, 'Image uploaded');
  } catch (error) {
    next(error);
  }
}

export async function uploadMultipleImages(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) { sendError(res, 'No files provided', 400); return; }
    const folder = (req.query.folder as string) || CLOUDINARY_FOLDERS.CONTENT;
    const results = await Promise.all(files.map((f) => uploadImage(f.buffer, folder)));
    sendCreated(res, results, `${results.length} images uploaded`);
  } catch (error) {
    next(error);
  }
}

export async function deleteUploadedImage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { publicId } = req.params;
    await deleteImage(decodeURIComponent(publicId));
    sendSuccess(res, null, 'Image deleted');
  } catch (error) {
    next(error);
  }
}
