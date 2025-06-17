import express from 'express';
import {
  getStudentNotification,
  markedAsRead,
} from '../services/notification.js';
import { verifyJwt } from '../middleware/verifyJwt.js';

const router = express.Router();

router.get('/', verifyJwt, getStudentNotification);
router.post('/read', verifyJwt, markedAsRead);

export default router;
