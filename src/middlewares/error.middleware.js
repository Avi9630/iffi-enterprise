import { Prisma } from '@prisma/client';
import logger from '../configs/logger.js';

export const errorMiddleware = (err, req, res, next) => {

    logger.error({
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
    });

    console.error(err);

    // Prisma validation error
    if (err instanceof Prisma.PrismaClientValidationError) {
        return res.status(422).json({
            status: false,
            message: "Invalid data provided.",
        });
    }

    // Prisma known request error
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        return res.status(400).json({
            status: false,
            message: "Database operation failed.",
        });
    }

    // Your custom AppError
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            status: false,
            message: err.message
        });
    }

    const statusCode = err.statusCode ?? 500;
    const message = err.message ?? 'Internal server error';

    res.status(statusCode).json({
        status: false,
        message,
    });
};