import { Router } from 'express';
import {
  createSubject,
  deleteSubject,
  getAllSubjects,
} from '../services/subject.js';
import { verifyJwt } from '../middleware/verifyJwt.js';
import { allowedTo } from '../config/allowedTo.js';
import { ROLES_LIST } from '../config/ROLES_LIST.js';
import { upload } from '../middleware/uploadFile.js';

const router = Router();

router
  .route('/')
  .get(
    verifyJwt,
    allowedTo(ROLES_LIST.Admin, ROLES_LIST.SuperAdmin),
    getAllSubjects
  )
  .post(
    verifyJwt,
    allowedTo(ROLES_LIST.SuperAdmin),
    upload.single('imgCover'),
    createSubject
  );

router.delete(
  '/:id',
  verifyJwt,
  allowedTo(ROLES_LIST.SuperAdmin),
  deleteSubject
);

export default router;
