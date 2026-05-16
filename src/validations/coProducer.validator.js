import Joi from 'joi';

// File object validator - Multer file structure validate karta hai

// const fileSchema = Joi.object({
//     fieldname: Joi.string().required(),
//     originalname: Joi.string().required(),
//     encoding: Joi.string().required(),
//     mimetype: Joi.string()
//         .valid('image/jpeg', 'image/png', 'image/jpg', 'application/pdf')
//         .required()
//         .messages({
//             'any.only': '{{#label}} must be jpeg, png, or pdf'
//         }),
//     buffer: Joi.binary().required(),
//     size: Joi.number()
//         .max(5 * 1024 * 1024)  // 5MB max
//         .required()
//         .messages({
//             'number.max': '{{#label}} must be less than 5MB'
//         }),
// }).unknown(true);

const fileSchema = Joi.object({

    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),

    mimetype: Joi.string()
        .valid('image/jpeg', 'image/png', 'image/jpg', 'application/pdf')
        .required()
        .messages({
            'any.only': '{{#label}} must be jpeg, png, jpg or pdf'
        }),

    buffer: Joi.binary().required(),

    size: Joi.number()
        .max(5 * 1024 * 1024)
        .required()
        .messages({
            'number.max': '{{#label}} must be less than 5MB'
        }),

}).unknown(true)
    .messages({
        'object.base': '{{#label}} must be file',
        'any.required': '{{#label}} is required'
    });

class CoProducerValidator {

    addCoProducerSchema() {
        return Joi.object({

            ip_application_form_id: Joi.number()
                .required(),

            co_producer_is: Joi.number()
                .valid(1, 2)
                .required(),

            name: Joi.string()
                .trim()
                .required(),

            email: Joi.string()
                .trim()
                .email()
                .required(),

            landline: Joi.string()
                .trim()
                .allow('', null),

            mobile: Joi.string()
                .trim()
                .required(),

            website: Joi.string()
                .trim()
                .uri()
                .allow('', null),

            address: Joi.string()
                .trim()
                .required(),

            is_indian_entity: Joi.number()
                .valid(1, 0)
                .required(),

            // Required when is_indian_entity = 1
            // co_producer_id_proof: Joi.when('is_indian_entity', {
            //     is: 1,
            //     then: fileSchema.required().messages({
            //         'any.required': 'co_producer_id_proof is required'
            //     }),
            //     otherwise: Joi.any().strip()  // value remove kar do response se
            // }),

            // Required when is_indian_entity = 0
            nationality: Joi.when('is_indian_entity', {
                is: 0,
                then: Joi.string().trim().required(),
                otherwise: Joi.string().trim().allow('', null)
            }),

            // Required when is_indian_entity = 0
            // passport_image: Joi.when('is_indian_entity', {
            //     is: 0,
            //     then: fileSchema.required().messages({
            //         'any.required': 'passport_image is required'
            //     }),
            //     otherwise: Joi.any().strip()  // value remove kar do response se
            // }),

            registration_details: Joi.string()
                .trim()
                .allow('', null),

            name_of_producers: Joi.string()
                .trim()
                .allow('', null),

            co_producer_id_proof: Joi.any(),
            passport_image: Joi.any(),

        });
    }

    updateCoProducerSchema() {
        return Joi.object({

            ip_application_form_id: Joi.number()
                .required(),

            co_producer_is: Joi.number()
                .valid(1, 2)
                .required(),

            name: Joi.string()
                .trim()
                .required(),

            email: Joi.string()
                .trim()
                .email()
                .required(),

            landline: Joi.string()
                .trim()
                .allow('', null),

            mobile: Joi.string()
                .trim()
                .required(),

            website: Joi.string()
                .trim()
                .uri()
                .allow('', null),

            address: Joi.string()
                .trim()
                .required(),

            is_indian_entity: Joi.number()
                .valid(1, 0)
                .required(),

            // Required when is_indian_entity = 1
            // co_producer_id_proof: Joi.when('is_indian_entity', {
            //     is: 1,
            //     then: fileSchema.required().messages({
            //         'any.required': 'co_producer_id_proof is required'
            //     }),
            //     otherwise: Joi.any().strip()  // value remove kar do response se
            // }),

            // Required when is_indian_entity = 0
            nationality: Joi.when('is_indian_entity', {
                is: 0,
                then: Joi.string().trim().required(),
                otherwise: Joi.string().trim().allow('', null)
            }),

            // Required when is_indian_entity = 0
            // passport_image: Joi.when('is_indian_entity', {
            //     is: 0,
            //     then: fileSchema.required().messages({
            //         'any.required': 'passport_image is required'
            //     }),
            //     otherwise: Joi.any().strip()  // value remove kar do response se
            // }),

            registration_details: Joi.string()
                .trim()
                .allow('', null),

            name_of_producers: Joi.string()
                .trim()
                .allow('', null),

            co_producer_id_proof: Joi.any(),
            passport_image: Joi.any(),

        });
    }
}

export default new CoProducerValidator();