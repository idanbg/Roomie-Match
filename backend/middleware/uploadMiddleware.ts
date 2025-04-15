import multer from 'multer';
import { storage } from '../utils/cloudinary';
import { Request } from 'express';

function checkFileType(
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(file.originalname.toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, PNG, and WEBP images are allowed'));
  }
}

const upload = multer({
  storage, // now using Cloudinary
  fileFilter: checkFileType,
});

export default upload;
