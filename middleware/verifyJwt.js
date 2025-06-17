import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';

export const verifyJwt = (req, res, next) => {
  const cookie = req.headers.cookie;
  if (!cookie) return next(new AppError(401, 'Unauthorized'));

  const jwtCookie = cookie
    .split(';')
    .find((cookie) => cookie.trim().startsWith('jwt='));

  if (!jwtCookie) return next(new AppError(401, 'Unauthorized'));

  const token = jwtCookie.split('=')[1];

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return next(new AppError(401, 'Unauthorized'));
    }
    req.student = decoded;

    next();
  });
};
