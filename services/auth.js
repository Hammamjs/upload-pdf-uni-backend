import AsyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import Student from '../model/student.js';
import AppError from '../utils/AppError.js';
import studentInfo from '../utils/studentInfo.js';
import { createHash } from 'crypto';
import { sendEmail } from '../utils/sendMail.js';

export const register = AsyncHandler(async (req, res, next) => {
  const {
    name,
    studentIdx,
    department,
    studentYear,
    email,
    password,
    semester,
    year,
  } = req.body;

  const isEmailExist = await Student.findOne({ email });

  if (isEmailExist) return next(new AppError(409, 'Email already exist'));

  const student = await Student.create({
    name,
    year,
    studentIdx,
    department,
    studentYear,
    semester,
    email,
    password,
  });
  const accessToken = jwt.sign(
    { role: student.role, id: student._id, studentIdx: student.studentIdx },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15min' }
  );
  const refreshToken = jwt.sign(
    {
      role: student.role,
      id: student._id,
      studentIdx: student.studentIdx,
      department: student.department,
      year: student.year,
      semester: student.semester,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '1d' }
  );

  student.refreshToken = refreshToken;
  await student.save();

  res.cookie('jwt', refreshToken, {
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'none',
  });

  res.status(201).json({
    message: 'Registeration compelete',
    student: studentInfo(student),
    accessToken,
  });
});

export const studentAuth = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const student = await Student.findOne({ email, active: true });

  if (!student) return next(new AppError(404, 'Email not exist or inactive'));

  const isMatched = await student.comparePassword(password, student.password);

  if (!isMatched) return next(new AppError(400, 'Email or password incorrect'));

  // create token;

  const accessToken = jwt.sign(
    { role: student.role, id: student._id, studentIdx: student.studentIdx },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15min' }
  );

  const refreshToken = jwt.sign(
    {
      role: student.role,
      id: student._id,
      studentIdx: student.studentIdx,
      department: student.department,
      year: student.year,
      semester: student.semester,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '1d' }
  );

  // assign refreshToken to student
  student.refreshToken = refreshToken;
  await student.save();

  res.cookie('jwt', refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // valid for one week
    httpOnly: true, // prevent javascript manipulation
    sameSite: 'none',
    secure: true,
  });

  res.status(200).json({
    message: 'Student Authenticated',
    student: studentInfo(student),
    accessToken,
  });
});

export const updatePassword = AsyncHandler(async (req, res, next) => {
  const { newPassword, currentPassword, email } = req.body;

  const student = await Student.findOne({ email });

  if (!student) return next(new AppError(404, 'Student Email not found'));

  const currentPasswordIsMatched = await student.comparePassword(
    currentPassword
  );

  if (!currentPasswordIsMatched)
    return next(new AppError(401, 'Current password were wrong'));

  student.password = newPassword;
  student.markModified('password');
  await student.save();

  res.status(201).json({ message: 'Password updated' });
});

export const handleLogOut = AsyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const student = await Student.findOne({ email });

  if (!student) {
    res.clearCookie('jwt', { secure: true, httpOnly: true });
    return next(new AppError(404, 'Student not found'));
  }

  student.refreshToken = '';
  await student.save();
  res.clearCookie('jwt', { secure: true, httpOnly: true });

  res.status(200).json({ message: 'Student logged out' });
});

export const forgotPassword = AsyncHandler(async (req, res, next) => {
  const email = req.body.email;

  const student = await Student.findOne({ email });

  if (!student) return next(new AppError(404, 'Student email not found'));

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedResetCode = createHash('sha256').update(resetCode).digest('hex');

  student.passwordResetCode = hashedResetCode;
  student.passwordResetCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  await student.save();
  const options = {
    name: student.name,
    email,
    resetCode,
  };

  await sendEmail(options);

  res.status(200).json({ message: 'Verification code sent' });
});

export const verifyResetCode = AsyncHandler(async (req, res, next) => {
  const { resetCode } = req.body;
  const hashedResetCode = createHash('sha256').update(resetCode).digest('hex');
  const student = await Student.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetCodeExpiry: { $gt: Date.now() },
  });
  if (!student) return next(new AppError(400, 'Invalid or expired code'));
  student.passwordResetIsVerified = true;
  await student.save();

  res.status(200).json({ message: 'Reset Code is verified' });
});

export const changeStudentPassword = AsyncHandler(async (req, res, next) => {
  const { email, newPassword } = req.body;
  const student = await Student.findOne({ email });

  if (!student) return next(new AppError(404, 'Student not found'));

  if (!student.passwordResetIsVerified)
    return next(new AppError(400, 'Reset code not verified'));

  student.password = newPassword;
  student.passwordResetCode = undefined;
  student.passwordResetCodeExpiry = undefined;
  student.passwordResetIsVerified = false;
  student.markModified('password');
  await student.save();

  res.status(200).json({ message: 'Password updated' });
});

export const handleRefreshToken = AsyncHandler(async (req, res, next) => {
  const cookie = req.cookies;

  const email = req.body.email;

  const student = await Student.findOne({ email });

  if (!student) return next(new AppError(404, 'Student not exist'));

  if (!cookie?.jwt) return next(new AppError(401, 'Student not authorized'));
  const token = cookie.jwt;

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err || decoded.id !== student._id.toString()) return res.status(401);
    const accessToken = jwt.sign('jwt', process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '15min',
    });

    const refreshToken = jwt.sign('jwt', process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1d',
    });
    student.refreshToken = refreshToken;
    await student.save();
    res.cookie('jwt', refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: 'Session refreshed', accessToken });
  });
});
