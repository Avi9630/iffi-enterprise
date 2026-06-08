import Joi from 'joi';

class IpFilmFestivalValidator {

    addIpFilmFestivalSchema() {
        return Joi.object({
            ip_application_form_id: Joi.number().required(),
            name_of_festival: Joi.string().required(),
            address_of_festival: Joi.string().required(),
            date_of_festival: Joi.date()
                .iso()
                .required()
                .messages({
                    'date.format': 'date_of_festival must be in YYYY-MM-DD format',
                    'date.base': 'date_of_festival must be a valid date'
                }),
        });
    }

    updateIpFilmFestivalSchema() {
        return Joi.object({
            ip_application_form_id: Joi.number().required(),
            name_of_festival: Joi.string().required(),
            address_of_festival: Joi.string().required(),
            date_of_festival: Joi.date()
                .iso()
                .required()
                .messages({
                    'date.format': 'date_of_festival must be in YYYY-MM-DD format',
                    'date.base': 'date_of_festival must be a valid date'
                }),
        });
    }
}

export default new IpFilmFestivalValidator();