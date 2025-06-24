import AsyncHandler from 'express-async-handler';
import AppError from '../utils/AppError.js';
import AppFeatures from '../utils/AppFeatures.js';
import Subject from '../model/subject.js';

export const getAllSubjects = AsyncHandler(async (req, res, next) => {
  const subjects = await Subject.find({});
  if (!subjects) next(new AppError(404, 'No Subject found'));
  res.status(200).json(subjects);
});

export const getSpecificSubjects = AsyncHandler(async (req, res, next) => {
  const features = new AppFeatures(Subject.find(), req.query);
  const subjects = await features.mongooseQuery();
  if (!subjects) next(new AppError(404, 'No Subject found'));
  res.status(200).json(subjects);
});

export const createSubject = AsyncHandler(async (req, res, next) => {
  const { semester, year, departments, name } = req.body;

  const isSubjectExist = await Subject.findOne({ name, year });
  if (isSubjectExist)
    return next(new AppError(409, 'The subject already exist'));
  await Subject.create({
    semester,
    year,
    departments,
    name,
    imgCover: req.file.path,
  });

  res.status(201).json({ message: 'Subject created' });
});

export const deleteSubject = AsyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (!id) next(new AppError(400, 'Id not provided'));
  await Subject.findOneAndDelete({ _id: id });
  res.status(204).json({ message: 'Subject removed' });
});
