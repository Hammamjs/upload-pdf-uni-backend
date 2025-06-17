import AsyncHandler from 'express-async-handler';
import Notifications from '../model/Notification.js';
import AppFeatures from '../utils/AppFeatures.js';

export const getStudentNotification = AsyncHandler(async (req, res, next) => {
  const id = req.student.id;
  const notifications = await Notifications.find({ studentId: id }).sort({
    createdAt: -1,
  });

  res.status(200).json(notifications);
});

export const markedAsRead = AsyncHandler(async (req, res) => {
  await Notifications.updateMany(
    { studentId: req.student.id, read: false },
    { read: true }
  );
  return res.status(200).json({ message: 'No messages left' });
});
