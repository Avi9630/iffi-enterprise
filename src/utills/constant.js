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

export const WEBSITE_TYPE = Object.freeze({
    IP: 1,
    OTT: 2,
    CMOT: 3
});

export const DOCUMENT_TYPE = Object.freeze({
    PRODUCER_ID_PROOF: 1,
    DIRECTOR_ID_PROOF: 2,
    UNCENSORED_FILE: 3,
    DECLARATION_CLAUSE_FILE: 4,
    FILE_CBFC_CERTIFICATE: 5,
    AUTHORIZATION_LATTER: 6,
    DECLARATION_LATTER: 7,
    SYNOPSIS_IN_ENGLISH: 8,
    DIRECTORS_PROFILE: 9,
    PRODUCERS_PROFILE: 10,
    DETAILS_OF_CAST_CREW: 11,
    GOV_ID_PROOF: 12,
    PASSPORT_IMAGE: 13,
    FIRST_GOV_ID_PROOF: 14,
    SECOND_GOV_ID_PROOF: 15,
    UPLOAD_CV: 16,
    UPLOAD_REEL: 17,
    CO_PRODUCER_ID_PROOF: 18,
});

export const FORM_STEPS = Object.freeze({
    FILM_DETAILS: 1,
    PRODUCERS_DETAILS: 2,
    DIRECTORS_DETAILS: 3,
    CREW_DETAILS: 4,
    CBFC_CERTIFICATION: 5,
    OTHER_DETAILS: 6,
    DOCUMENTS: 7,
    DECLARATION_PAYMENT: 8,
    SUBMISSION: 9
});
