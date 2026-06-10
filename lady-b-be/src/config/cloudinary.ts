import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export const CLOUDINARY_FOLDERS = {
  PRODUCTS: `${env.CLOUDINARY_FOLDER}/products`,
  COLLECTIONS: `${env.CLOUDINARY_FOLDER}/collections`,
  CUSTOM_ORDERS: `${env.CLOUDINARY_FOLDER}/custom-orders`,
  AVATARS: `${env.CLOUDINARY_FOLDER}/avatars`,
  CONTENT: `${env.CLOUDINARY_FOLDER}/content`,
} as const;

export async function uploadImage(
  fileBuffer: Buffer,
  folder: string,
  options: Record<string, unknown> = {},
) {
  return new Promise<{ url: string; publicId: string; width: number; height: number }>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: 'image',
            transformation: [{ quality: 'auto', fetch_format: 'auto' }],
            ...options,
          },
          (error, result) => {
            if (error) return reject(error);
            if (!result) return reject(new Error('No result from Cloudinary'));
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              width: result.width,
              height: result.height,
            });
          },
        )
        .end(fileBuffer);
    },
  );
}

export async function deleteImage(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}
