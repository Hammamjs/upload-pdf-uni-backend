import { Router } from 'express';
import { upload } from '../middleware/uploadFile.js';
import {
  deleteFile,
  getFiles,
  getStudentFiles,
  uploadPDFFile,
} from '../services/pdf.js';
import { verifyJwt } from '../middleware/verifyJwt.js';
import { allowedTo } from '../config/allowedTo.js';
import { ROLES_LIST } from '../config/ROLES_LIST.js';
import {
  deleteFileValidation,
  uploadFileValidation,
} from '../utils/validation/uploadFileValidation.js';

const router = Router();

router.get('/student-file', verifyJwt, getStudentFiles);

router
  .route('/')
  .get(getFiles)
  .post(
    verifyJwt,
    allowedTo(ROLES_LIST.SuperAdmin, ROLES_LIST.Admin),
    upload.single('file'),
    uploadFileValidation,
    uploadPDFFile
  );

router.delete(
  '/:id',
  verifyJwt,
  allowedTo(ROLES_LIST.SuperAdmin, ROLES_LIST.Admin),
  deleteFileValidation,
  deleteFile
);
export default router;
