import AsyncHandler from 'express-async-handler';
import Student from '../model/student.js';
import studentInfo from '../utils/studentInfo.js';
import AppError from '../utils/AppError.js';
import { ROLES_LIST } from '../config/ROLES_LIST.js';

export const getStudents = AsyncHandler(async (req, res, next) => {
  const students = await Student.find();
  if (!students) return next(new AppError(404, 'No users found'));
  res.status(200).json({
    results: {
      count: students.length,
      students,
    },
  });
});

export const CreateAccount = AsyncHandler(async (req, res, next) => {
  const { name, studentIdx, email, password, year, department, semester } =
    req.body;
  const student = await Student.create({
    name,
    studentIdx,
    email,
    password,
    department,
    year,
    semester,
  });

  res.status(201).json({
    message: 'Student account created',
    student: studentInfo(student),
  });
});

export const updateStudent = AsyncHandler(async (req, res, next) => {
  const body = req.body;
  // Exclude pass
  delete body.password;

  let id; // if request send to update user data or user role

  if (body.role) {
    id = body.id;
  } else {
    // if user to update his personal data not the role
    id = req.student.id;
  }

  if (req.student.role === 'SuperAdmin' && body.id === req.student.id) {
    return next(new AppError(400, 'SuperAdmin cannot change his role'));
  }

  console.log('ID: ', id);
  console.log('body: ', body);

  const student = await Student.findOneAndUpdate(
    { _id: id },
    { ...body },
    {
      new: true,
    }
  );

  console.log(student);

  if (!student) return next(new AppError(404, 'Student account not exist'));

  res
    .status(200)
    .json({ message: 'Student data updated', student: studentInfo(student) });
});

export const deactivateAccount = AsyncHandler(async (req, res, next) => {
  const id = req.body.id;
  const student = await Student.findOne({ _id: id });
  if (!student) return next(new AppError(400, 'Student Email not exist'));
  if (student.role === ROLES_LIST.SuperAdmin)
    return next(new AppError(400, 'Super Admin delete account is denied'));

  await student.updateOne({ active: false });
  res.status(204).json({ message: 'Account is deactivated' });
});

export const activateAccount = AsyncHandler(async (req, res, next) => {
  const { id } = req.body;

  const student = await Student.findByIdAndUpdate(
    id,
    { active: true },
    { new: true }
  );

  if (!student) return next(new AppError(400, 'Student Email not exist'));
  res.status(200).json({ message: 'Account is activated' });
});

export const getStudent = AsyncHandler(async (req, res, next) => {
  const name = req.body.name;
  const student = await Student.findOne({ name });
  if (!student) return next(new AppError(404, 'No user found'));
  res.status(200).json({
    student,
  });
});

export const deleteAccount = AsyncHandler(async (req, res, next) => {
  const id = req.body._id;

  const student = await Student.findById(id);

  if (!student) return next(new AppError(404, 'Student not found'));

  if (student?.role === 'SuperAdmin')
    return next(new AppError(400, 'Super Admin Cannot delete his account'));

  await student.deleteOne();

  res.status(204).json({ message: 'Account deleted' });
});
