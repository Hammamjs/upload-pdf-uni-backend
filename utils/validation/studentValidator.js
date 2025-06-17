import { check } from 'express-validator';
import validationMiddelware from '../../middleware/validationMiddleware.js';
import Student from '../../model/student.js';

export const createAccountValidator = [
  check('name').notEmpty().withMessage('Name is required'),
  check('password').notEmpty().withMessage('Password is required'),
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email')
    .custom(async (email) => {
      const student = await Student.findOne({ email });
      if (student) throw new Error('Email already exist');
      return true;
    }),
  check('studentIdx').notEmpty().withMessage('Student index is required'),
  check('department').notEmpty().withMessage('Department is required'),
  check('studentYear').notEmpty().withMessage('Student study year is required'),
  validationMiddelware,
];

export const updateAccountValidator = [
  check('id').isMongoId().withMessage('Invalid id'),
  validationMiddelware,
];
