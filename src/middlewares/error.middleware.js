import logger from '../configs/logger.js';

export const errorMiddleware = (err, req, res, next) => {

    logger.error({
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
    });

    const statusCode = err.statusCode ?? 500;
    const message = err.message ?? 'Internal server error';
    
    // const message = err.isOperational ? err.message : 'Internal server error';
    // if (!err.isOperational) {
    //     logger.error({ message: err.message, stack: err.stack, requestId: req.requestId });
    // }

    res.status(statusCode).json({
        status: false,
        message,
    });
};