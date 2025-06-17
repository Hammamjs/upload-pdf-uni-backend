import { Router } from 'express';
import {
  changeStudentPassword,
  forgotPassword,
  handleLogOut,
  register,
  studentAuth,
  updatePasswoord,
  verifyResetCode,
} from '../services/auth.js';
import { verifyJwt } from '../middleware/verifyJwt.js';
import {
  forgotPasswordValidator,
  regisetrValidator,
  ResetCodeValidator,
  ResetPasswordValidator,
  studentAuthValidator,
  updateStudentValidator,
} from '../utils/validation/authValidator.js';
import rateLimit from '../utils/rateLimiter.js';

const router = Router();
// rateLimit
router.post('/', studentAuthValidator, studentAuth);

router.post(
  '/register',
  // rateLimit,
  regisetrValidator,
  register
);

router.put(
  '/update-password',
  verifyJwt,
  updateStudentValidator,
  updatePasswoord
);

router.post('/logout', rateLimit, verifyJwt, handleLogOut);

router.post('/forgot-password', forgotPasswordValidator, forgotPassword);
router.post('/verify-code', ResetCodeValidator, verifyResetCode);
router.patch('/reset-password', ResetPasswordValidator, changeStudentPassword);

export default router;
