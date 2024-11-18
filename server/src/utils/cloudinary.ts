import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

/**
 * Uploads an image to Cloudinary and returns the secure URL of the uploaded image.
 *
 * @param {Express.Multer.File} image - The image file to be uploaded.
 * @returns {Promise<string>} - The secure URL of the uploaded image.
 */
export async function uploadImage(image: Express.Multer.File): Promise<string> {
  try {
    // Convert Buffer to base64
    const base64Data = image.buffer.toString('base64');
    const fileUri = `data:${image.mimetype};base64,${base64Data}`;

    // Upload to Cloudinary
    const result: UploadApiResponse = await cloudinary.uploader.upload(fileUri, {
      folder: 'TaskpulseUserImages',
    });

    return result.secure_url;
  } catch (error) {
    console.error('Image upload failed:', error);
    throw new Error('Failed to upload image');
  }
}
