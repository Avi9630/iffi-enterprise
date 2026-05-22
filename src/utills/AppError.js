import { ERROR_CODES } from "./constant.js";

class AppError extends Error {

    constructor(message, statusCode, errorCode) {
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

export default AppError;
// export default new AppError();