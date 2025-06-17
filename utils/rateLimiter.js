import rateLimiter from 'express-rate-limit';

const rateLimit = rateLimiter({
  windowMs: 60 * 60 * 1000, // one hour
  legacyHeaders: false,
  limit: 3,
  message: 'Too requests from this ip try again after one hour',
});

export default rateLimit;
