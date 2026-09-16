
export const validateRequest = (schema) => {
    return (req, res, next) => {

        const { error, value } = schema.validate(req.body, { abortEarly: false, allowUnknown: false });
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
        req.body = value;
        next();
    };
};