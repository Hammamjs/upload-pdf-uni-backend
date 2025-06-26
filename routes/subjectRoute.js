import { Router } from 'express';
import {
  createSubject,
  deleteSubject,
  getAllSubjects,
  updateSubject,
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
  .post(verifyJwt, allowedTo(ROLES_LIST.SuperAdmin), createSubject)
  .patch(
    verifyJwt,
    allowedTo(ROLES_LIST.SuperAdmin, ROLES_LIST.Admin),
    updateSubject
  )
  .delete();

router.delete(
  '/:id',
  verifyJwt,
  allowedTo(ROLES_LIST.SuperAdmin, ROLES_LIST.Admin),
  deleteSubject
);

export default router;
