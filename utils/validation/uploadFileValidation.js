import { check } from 'express-validator';
import validationMiddelware from '../../middleware/validationMiddleware.js';

export const uploadFileValidation = [
  check('title').notEmpty().withMessage('File title is required'),
  check('subject').notEmpty().withMessage('File title is required'),
  // check('pdfCover').notEmpty().withMessage('PDF Cover is required'),
  check('year').notEmpty().withMessage('File should belong to specific year'),
  check('semester')
    .notEmpty()
    .withMessage('File should belong to specific semester'),
  check('departments')
    .isArray()
    .withMessage('Should be array of departments')
    .notEmpty()
    .withMessage('departments is required'),
  validationMiddelware,
];

export const deleteFileValidation = [
  check('id').notEmpty().withMessage('Invalid id'),
  validationMiddelware,
];
