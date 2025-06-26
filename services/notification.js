import AsyncHandler from 'express-async-handler';
import Notifications from '../model/Notification.js';
import AppFeatures from '../utils/AppFeatures.js';
import { io } from '../app.js';

export const getStudentNotification = AsyncHandler(async (req, res, next) => {
  const id = req.student.id;
  const notifications = await Notifications.find({ studentId: id }).sort({
    createdAt: -1,
  });

  res.status(200).json(notifications);
});

export const markedAllAsRead = AsyncHandler(async (req, res) => {
  await Notifications.updateMany(
    { studentId: req.student.id, isRead: false },
    { isRead: true }
  );
  return res.status(200).json({ message: 'No messages left' });
});

export const markedAsRead = AsyncHandler(async (req, res) => {
  const notification = await Notifications.findByIdAndUpdate(
    { _id: req.body.id },
    { isRead: true },
    { new: true }
  );

  io.to(`student-${req.student.id}`).emit('notification');

  return res.status(200).json({ message: 'messages read', notification });
});
