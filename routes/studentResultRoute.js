import { Router } from 'express';
import { verifyJwt } from '../middleware/verifyJwt.js';
import { studentResult } from '../services/studentResult.js';

const router = Router();

router.get('/', verifyJwt, studentResult);

export default router;
