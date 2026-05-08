import Joi from "joi";

export const registerSchema = Joi.object({
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

    type_id: Joi.number()
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

// export const registerSchema = Joi.object({
//     first_name: Joi.string().trim().min(3).required(),
// });

export default { registerSchema };
