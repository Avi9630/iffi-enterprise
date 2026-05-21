
import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    skipSuccessfulRequests: true,
    message: { success: false, status: 429, message: 'Too many requests, please try again later.' },
});

export const globalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 200,
    message: { success: false, status: 429, message: 'Too many requests, please try again later.' },
});

// export default { authLimiter, globalLimiter };


// const rateLimit = require('express-rate-limit');

// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // Limit each IP to 100 requests per windowMs
//     message: 'Too many requests from this IP, please try again later.',
//     standardHeaders: true,
//     legacyHeaders: false,
// });

// const authLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 5, // 5 login attempts per 15 minutes
//     message: 'Too many login attempts, please try again later.',
//     skipSuccessfulRequests: true,
// });

// export default { limiter, authLimiter };

// // module.exports = { limiter, authLimiter };