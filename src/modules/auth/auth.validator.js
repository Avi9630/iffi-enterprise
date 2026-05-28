import Joi from "joi";

const registerSchema = Joi.object({
    first_name: Joi.string()
        .trim()
        .min(3)
        .required(),

    last_name: Joi.string()
        .trim()
        .min(3)
        .required(),

    email: Joi.string()
        .email()
        .required(),

    mobile: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required()
        .messages({
            "string.pattern.base": "Mobile must be exactly 10 digits"
        }),

    client_type_id: Joi.number()
        .integer()
        .positive()
        .required(),

    password: Joi.string()
        .min(6)
        .required(),

    password_confirmation: Joi.string()
        .min(6)
        .valid(Joi.ref('password'))
        .required()
        .messages({
            "any.only": "Password confirmation must match password"
        }),

    captcha: Joi.string().required(),
});

const verifyEmailSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),
});

const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .min(6)
        .required(),
});

const resetPasswordSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),
});

const sendOtpSchema = Joi.object({
    type: Joi.string().valid('EMAIL', 'MOBILE').required(),
    target: Joi.when('type', {
        is: 'EMAIL',
        then: Joi.string().trim().email({ tlds: false }).required(),
        otherwise: Joi.string()
            .pattern(/^[6-9]\d{9}$/)
            .required()
            .messages({ 'string.pattern.base': 'Please enter a valid mobile number' })
    })
});

// const verifyOtpSchema = Joi.object({
//     type: Joi.string().valid('EMAIL', 'MOBILE').required(),
//     target: Joi.when('type', {
//         is: 'EMAIL',
//         then: Joi.string().trim().email({ tlds: false }).required(),
//         otherwise: Joi.string()
//             .pattern(/^[6-9]\d{9}$/)
//             .required()
//             .messages({ 'string.pattern.base': 'Please enter a valid mobile number' })
//     }),
//     otp: Joi.number()
//         .integer()
//         .positive()
//         .required(),
// });

const changePasswordSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .min(6)
        .required(),

    password_confirmation: Joi.string()
        .min(6)
        .valid(Joi.ref('password'))
        .required()
        .messages({
            "any.only": "Password confirmation must match password"
        }),
});

const verifyOtpSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),

    otp: Joi.number()
        .integer()
        .positive()
        .required(),
});

export default { registerSchema, verifyEmailSchema, loginSchema, resetPasswordSchema, changePasswordSchema, verifyOtpSchema, sendOtpSchema };
