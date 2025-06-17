import AppError from '../utils/AppError.js';

export const allowedTo =
  (...permissions) =>
  (req, res, next) => {
    const studentRole = req.student.role;
    if (!permissions.includes(studentRole)) {
      return next(new AppError(403, 'Not allowed for this action'));
    }
    next();
  };
