import AppError from '../utills/AppError.js';

export default (schema, property = "body") => {

    return (req, res, next) => {

        const { error } = schema.validate(req[property], {
            abortEarly: false,
            // allowUnknown: true
        });

        if (error) {

            const formattedErrors = {};

            error.details.forEach(err => {
                const field = err.path.join(".");
                formattedErrors[field] = err.message.replace(/"/g, "");
            });

            return res.status(400).json({
                status: false,
                message: "Validation error",
                errors: formattedErrors
            });
        }

        // if (error) {
        //     return res.status(400).json({
        //         success: false,
        //         errors: error.details.map(err => err.message)
        //     });
        // }

        next();
    };
};
