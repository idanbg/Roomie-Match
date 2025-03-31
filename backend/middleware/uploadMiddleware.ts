import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// Configure storage for uploaded images
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

// Filter to allow only image files
function checkFileType(
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, and PNG images are allowed'));
  }
}

// Final upload middleware
const upload = multer({
  storage,
  fileFilter: checkFileType,
});

export default upload;
