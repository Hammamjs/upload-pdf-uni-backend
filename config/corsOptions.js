import { allowedOrigins } from './allowedOrigin.js';
const corsOptions = {
  origin: (origin, cb) => {
    if (allowedOrigins.includes(origin) || !origin) {
      cb(null, true);
    } else cb(new Error('Origin not allowed'));
  },
  optionsSuccessStatus: 200,
  credentials: true,
};

export default corsOptions;
