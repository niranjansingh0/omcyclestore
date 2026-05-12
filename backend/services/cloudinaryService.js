import cloudinary from '../config/cloudinary.js';
import config from '../config/index.js';
import AppError from '../utils/appError.js';

const ensureCloudinary = () => {
  if (!config.cloudinary.cloudName || !config.cloudinary.apiKey || !config.cloudinary.apiSecret) {
    throw new AppError('Cloudinary is not configured', 500);
  }
};

export const uploadBuffer = async (buffer, folder = config.cloudinary.folder) => {
  ensureCloudinary();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            public_id: result.public_id,
            url: result.secure_url
          });
        }
      }
    );

    stream.end(buffer);
  });
};
