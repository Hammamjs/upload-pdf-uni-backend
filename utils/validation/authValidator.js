import { check } from 'express-validator';
import validationMiddelware from '../../middleware/validationMiddleware.js';

export const regisetrValidator = [
  check('name').notEmpty().withMessage('Student name is required'),
  check('studentIdx').notEmpty().withMessage('Student index is required'),
  check('department').notEmpty().withMessage('Student department is required'),
  check('password')
    .notEmpty()
    .withMessage('Student department is required')
    .isLength({ min: 7 })
    .withMessage('Password is too short'),
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email'),
  check('semester').notEmpty().withMessage('Student semester is required'),
  validationMiddelware,
];

export const studentAuthValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email'),
  check('password').notEmpty().withMessage('Password is required'),
  validationMiddelware,
];

export const updateStudentValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email'),
  check('newPassword')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Passowrd is too short')
    .custom((password, { req }) => {
      if (password !== req.body.confirmPassword)
        throw new Error('Password and password confirmation not match');
      return true;
    }),
  validationMiddelware,
];

export const forgotPasswordValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email'),
  validationMiddelware,
];

export const ResetCodeValidator = [
  check('resetCode')
    .notEmpty()
    .withMessage('Email is required')
    .isLength({ min: 5 })
    .withMessage('Rest code is too short')
    .isLength({ max: 7 })
    .withMessage('Rest code is too long'),
  validationMiddelware,
];

export const ResetPasswordValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email'),
  check('newPassword')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password is too short')
    .custom((password, { req }) => {
      if (password !== req.body.confirmPassword)
        throw new Error('Password and password confirmation not match');
      return true;
    }),
  validationMiddelware,
];
