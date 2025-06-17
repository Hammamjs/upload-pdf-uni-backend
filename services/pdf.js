import AsyncHandler from 'express-async-handler';
import PDF from '../model/pdf.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { io } from '../app.js';

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
    department: student.department,
    semester: student.semester,
    year: student.year,
  });

  res.status(200).json(files);
});

export const uploadPDFFile = AsyncHandler(async (req, res) => {
  const { title, year, semester, department, subject } = req.body;

  if (!req.files) return res.status(200).json({ message: 'Missing files' });

  const fileExist = await PDF.findOne({ title });

  if (fileExist) return new AppError(409, 'File title is already exist');

  try {
    const pdf = await PDF.create({
      title,
      subject,
      year,
      semester,
      pdfCover: req.files.pdfCover[0].path,
      department,
    });

    const filename = req.files.file[0].originalname;
    const id = await uploadFileToDrive(filename);
    const result = await generatePublicUrl(id);

    pdf.fileId = id;
    pdf.view = result.webViewLink;
    pdf.content = result.webContentLink;

    await pdf.save();
    // remove file after uploaded
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const filePath = path.resolve(__dirname, '..', 'uploads', filename);

    await fs.promises.unlink(filePath);

    // when file uploaded notify student there's new PDF
    // get all users to notify them there is a new file uploaded
    const students = await Student.find({});

    const filteredStudent = students.filter(
      (student) =>
        department.includes(student.department) &&
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
