import multer, { diskStorage } from 'multer';
import path from 'path';

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const name =
      file.fieldname === 'file'
        ? file.originalname
        : '_' + Date.now() + file.originalname;
    const exte = path.extname(file.mimetype);
    cb(null, name + exte);
  },
});

export const upload = multer({ storage });
