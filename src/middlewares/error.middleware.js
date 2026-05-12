import logger from '../configs/logger.js';
import env from '../configs/env.js';

const errorHandler = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    logger.error({
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userId: req.user?.id,
    });

    if (env.NODE_ENV === 'development') {
        return res.status(err.statusCode).json({
            status: false,
            message: err.message,
            stack: err.stack,
            error: err,
        });
    }

    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    return res.status(500).json({
        success: false,
        message: 'Something went wrong!',
    });
};

export default errorHandler;