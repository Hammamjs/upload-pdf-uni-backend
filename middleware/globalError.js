export const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    ErrorsInDevelopementMode(err, res);
  } else {
    ErrorsInProductionMode(err, res);
  }
};

const ErrorsInDevelopementMode = (err, res) => {
  return res.status(err.statusCode).json({
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const ErrorsInProductionMode = (err, res) => {
  return res.status(err.statusCode).json({
    message: err.message,
  });
};
