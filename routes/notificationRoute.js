import express from 'express';
import {
  getStudentNotification,
  markedAsRead,
  markedAllAsRead,
} from '../services/notification.js';
import { verifyJwt } from '../middleware/verifyJwt.js';

const router = express.Router();

router.get('/', verifyJwt, getStudentNotification);
router.post('/read', verifyJwt, markedAllAsRead);
router.patch('/update-notification', verifyJwt, markedAsRead);

export default router;
