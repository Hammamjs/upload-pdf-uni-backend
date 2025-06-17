import studentsRoute from './studentRoute.js';
import authRoute from './authRoute.js';
import PDFRoute from './pdfRoute.js';
import studentResultRoute from './studentResultRoute.js';
import notificationRoute from './notificationRoute.js';
import subjectRoute from './subjectRoute.js';

import AppError from '../utils/AppError.js';

const mountRoutes = (app) => {
  app.use('/api/v1/students', studentsRoute);
  app.use('/api/v1/auth', authRoute);
  app.use('/api/v1/file', PDFRoute);
  app.use('/api/v1/result', studentResultRoute);
  app.use('/api/v1/notifications', notificationRoute);
  app.use('/api/v1/subject', subjectRoute);

  app.all('*', (req, res, next) => {
    return next(new AppError(400, 'No route matched'));
  });
};

export default mountRoutes;
