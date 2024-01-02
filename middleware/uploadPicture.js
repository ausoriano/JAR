import { fileURLToPath } from 'url';
import path from 'path';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//path is built in in node module package

// storage of the picture where the picture is save
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadPicture = multer({
  storage: storage,
  limits: {
    fileSize: 1 * 1000000, // 2 MB Maximum
  },

  // fileFilter to allow only .png, .jpg and .jpeg
  fileFilter: (req, file, cb) => {
    console.log(file);
    let ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      return cb(new Error('File type is not supported'));
    }
    cb(null, true);
  },
});

export { uploadPicture };
