import Joi from "joi";

const masterDataSchema = Joi.object({
    type: Joi.string()
        .valid('client-type-list','client-list','language-list', 'genre', 'country', 'state', 'city')
        .required()
});

export default { masterDataSchema };
