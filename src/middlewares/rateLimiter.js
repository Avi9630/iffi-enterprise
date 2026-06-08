import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    skipSuccessfulRequests: true,
    message: { success: false, status: 429, message: 'Too many requests, please try again later.' },
});

export const globalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 200,
    message: { success: false, status: 429, message: 'Too many requests, please try again later.' },
});