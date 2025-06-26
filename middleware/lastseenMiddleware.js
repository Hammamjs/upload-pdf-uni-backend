import Student from '../model/student.js';
import AsyncHandler from 'express-async-handler';

const lastseen = AsyncHandler(async (req, res, next) => {
  if (req.student) {
    try {
      await Student.findOneAndUpdate(
        { _id: req.student.id },
        { lastseen: new Date() },
        { new: true }
      );
    } catch (err) {
      console.log(err);
    }
  }
  next();
});

export default lastseen;
