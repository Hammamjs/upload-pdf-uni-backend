import { Router } from 'express';

import {
  getStudent,
  CreateAccount,
  deactivateAccount,
  getStudents,
  deleteAccount,
  updateStudent,
  activateAccount,
} from '../services/student.js';
import {
  createAccountValidator,
  updateAccountValidator,
} from '../utils/validation/studentValidator.js';
import { verifyJwt } from '../middleware/verifyJwt.js';
import { allowedTo } from '../config/allowedTo.js';
import { ROLES_LIST } from '../config/ROLES_LIST.js';

const router = Router();

router
  .route('/')
  .post(createAccountValidator, CreateAccount)
  .get(verifyJwt, allowedTo(ROLES_LIST.SuperAdmin), getStudents)
  .put(verifyJwt, updateStudent)
  .delete(verifyJwt, updateAccountValidator, deleteAccount);

router.get('/:name', getStudent);
router
  .route('/activate')
  .put(verifyJwt, allowedTo(ROLES_LIST.SuperAdmin), activateAccount)
  .patch(
    verifyJwt,
    allowedTo(ROLES_LIST.SuperAdmin, ROLES_LIST.Admin, ROLES_LIST.Student),
    deactivateAccount
  );

export default router;
