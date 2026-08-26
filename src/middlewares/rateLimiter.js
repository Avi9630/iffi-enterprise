import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    skipSuccessfulRequests: true,
    message: {
        success: false,
        status: 429,
        message: 'Too many requests, please try again later.'
    },
});

export const globalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 50,
    message: {
        success: false,
        status: 429,
        message: 'Too many requests, please try again later.'
    },
});