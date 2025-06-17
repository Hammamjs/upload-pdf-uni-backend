class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.status = `${statusCode}`.startsWith(4) ? 'fail' : 'error';
    this.statusCode = statusCode;
    this.isOpertional = true;
  }
}

export default AppError;
