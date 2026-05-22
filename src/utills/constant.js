export const ROLES = Object.freeze({
    USER: 'user',
});

export const TOKEN_TYPES = Object.freeze({
    ACCESS: 'access',
    REFRESH: 'refresh',
    RESET_PASSWORD: 'reset',
});

export const HTTP_STATUS = Object.freeze({
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE: 422,
    INTERNAL_ERROR: 500,
});

export const ERROR_CODES = Object.freeze({
    VALIDATION_ERROR: 'validation_error',
    UNAUTHORIZED: 'unauthorized',
    FORBIDDEN: 'not_enough_permissions',
    NOT_FOUND: 'not_found',
    CONFLICT: 'conflict',
    INTERNAL_ERROR: 'internal_server_error',
});
