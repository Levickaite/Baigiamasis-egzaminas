import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import path from 'path';

// Ensure environment variables are loaded when this module is imported under ESM.
// In ESM, top-level imports are hoisted, so calling dotenv.config() here guarantees
// the .env in the Backend folder is read before we call cloudinary.config().
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Laikinas failų saugojimas prieš įkeliant į Cloudinary
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

export { cloudinary, upload };
