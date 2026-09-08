
export default (schema, property = "body") => {

    return (req, res, next) => {

        const { error } = schema.validate(req[property], {
            abortEarly: false,
            // stripUnknown: true,
            allowUnknown: true
        });

        if (error) {

            const formattedErrors = {};

            error.details.forEach(err => {
                const field = err.path.join(".");
                formattedErrors[field] = err.message.replace(/"/g, "");
            });

            return res.status(422).json({
                status: false,
                message: "Validation failed.!",
                errors: formattedErrors
            });
        }
        next();
    };
};
