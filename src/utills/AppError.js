// export class AppError extends Error {
//     constructor(message, statusCode) {
//         super(message);
//         this.statusCode = statusCode;
//         this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
//         this.isOperational = true;
//         Error.captureStackTrace(this, this.constructor);
//     }
// }

import { ERROR_CODES } from "./constant.js";

export class AppError extends Error {
    constructor(statusCode, message, errorCode) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode ?? AppError._deriveCode(statusCode);
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }

    static _deriveCode(statusCode) {
        const map = {
            400: ERROR_CODES.VALIDATION_ERROR,
            401: ERROR_CODES.UNAUTHORIZED,
            403: ERROR_CODES.FORBIDDEN,
            404: ERROR_CODES.NOT_FOUND,
            409: ERROR_CODES.CONFLICT,
        };
        return map[statusCode] ?? ERROR_CODES.INTERNAL_ERROR;
    }
}