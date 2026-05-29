import Joi from "joi";

const masterDataSchema = Joi.object({
    type: Joi.string()
        .valid('client-list', 'client-type-list','language-list', 'genre', 'country', 'state', 'city')
        .required()
});

export default { masterDataSchema };
