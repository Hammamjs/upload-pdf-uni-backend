import AsyncHandler from 'express-async-handler';
import PDF from '../model/pdf.js';
import { io } from '../app.js';
import { unlink } from 'fs/promises';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

import AppError from '../utils/AppError.js';
import {
  deletePDF,
  generatePublicUrl,
  uploadFileToDrive,
} from '../utils/googleOperations.js';
import AppFeatures from '../utils/AppFeatures.js';
import Student from '../model/student.js';
import Notifications from '../model/Notification.js';

export const getFiles = AsyncHandler(async (req, res) => {
  const features = new AppFeatures(PDF.find(), req.query)
    .search()
    .sort()
    .filter();

  const PDFS = await features.mongooseQuery;

  res.status(200).json({ PDFS });
});

export const getStudentFiles = AsyncHandler(async (req, res, next) => {
  const student = await Student.findOne({ _id: req.student.id });
  if (!student) next(new AppError(404, 'Student no longer member'));

  const files = await PDF.find({
    departments: student.department,
    semester: student.semester,
    year: student.year,
  });

  console.log(files);
  res.status(200).json(files);
});

export const uploadPDFFile = AsyncHandler(async (req, res, next) => {
  const { title, year, semester, departments, subject } = req.body;
  if (!req.file) return next(new AppError(400, 'PDF file are missing'));

  // const fileExist = await PDF.findOne({ title });

  // if (fileExist) return new AppError(409, 'File title is already exist');

  try {
    const pdf = await PDF.create({
      title,
      subject,
      year,
      semester,
      departments,
      size: req.file.size,
    });

    const filename = req.file.filename;
    const id = await uploadFileToDrive(filename);
    const result = await generatePublicUrl(id);

    pdf.fileId = id;
    pdf.view = result.webViewLink;
    pdf.content = result.webContentLink;

    await pdf.save();

    // when file uploaded notify student there's new PDF
    // get all users to notify them there is a new file uploaded
    const students = await Student.find({});

    const filteredStudent = students.filter(
      (student) =>
        departments.includes(student.department) &&
        student.year === year &&
        student.semester === semester
    );

    const notification = filteredStudent.map((student) => ({
      studentId: student._id,
      message: `New file uploaded: ${title}`,
      subject,
    }));

    // Insert notification for all students
    await Notifications.insertMany(notification);

    filteredStudent.forEach((student) => {
      io.to(`student-${student._id}`).emit('notification', {
        message: `New file uploaded: ${title}`,
        read: false,
        createdAt: Date.now(),
        studentId: student._id,
      });
    });

    // remove file after uploaded
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const filePath = path.resolve(__dirname, '..', 'uploads', filename);

    await unlink(filePath);

    res.status(201).json({ message: 'PDF uploaded', file: pdf });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export const deleteFile = AsyncHandler(async (req, res, next) => {
  const file = await PDF.findOneAndDelete({ _id: req.params.id });

  if (!file) return next(new AppError(404, 'File not exist'));
  await deletePDF(file.fileId);

  res.status(204).json({ message: 'File deleted' });
});
