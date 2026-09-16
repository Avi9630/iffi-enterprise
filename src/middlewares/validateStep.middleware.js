import ipValidator from "../modules/ip-app/ip.validator.js";
import { validateRequest } from "./validate.middleware.js";
import { IP_FORM_STEPS, IP_STEP_DOCUMENT_MAP } from "../constants/index.js";
import AppError from "../utills/AppError.js";

class ValidateStepMiddleware {

    constructor() {
        this.validateByStep = this.validateByStep.bind(this);
    }

    async validateByStep(req, res, next) {
        try {

            const { step } = req.body;

            // Check step
            if (!step) {
                return res.status(422).json({
                    status: false,
                    message: "Validation failed!",
                    errors: {
                        step: "step is required.!"
                    }
                });
            }

            // Validate valide step
            const validSteps = Object.values(IP_FORM_STEPS);
            if (!validSteps.includes(Number(step))) {
                return res.status(400).json({
                    status: false,
                    message: "Validation error",
                    errors: {
                        step: `step must be one of: ${validSteps.join(', ')}`
                    }
                });
            }

            // const fileValidationError = await this.validateStepFiles(Number(step), req.files || []);
            // if (Object.keys(fileValidationError).length > 0) {
            //     return res.status(422).json({
            //         status: false,
            //         message: 'Validation failed.!',
            //         errors: fileValidationError,
            //     });
            // }

            // Get Joi schema || Fields to validate...!
            const schema = ipValidator.getSchemaForStep(Number(step));

            if (!schema) {
                throw new AppError('Validation error', 400, {
                    step: `No validation schema defined for step ${step}`
                });
            }
            // return validateRequest(schema)(req, res, next);

            return validateRequest(schema)(req, res,
                async () => {

                    const fileValidationError = await this.validateStepFiles(Number(step), req.files || []);

                    if (Object.keys(fileValidationError).length > 0) {
                        return res.status(422).json({
                            status: false,
                            message: 'Validation failed.!',
                            errors: fileValidationError,
                        });
                    }

                    next();
                }
            );

        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    status: error.status,
                    message: error.message,
                    errors: error.errors
                });
            }

            next(error);
        }
    };

    async validateStepFiles(step, files) {

        const fileRules = IP_STEP_DOCUMENT_MAP[step] || [];

        const errors = {};
        
        // Check required file

        for (const fileRule of fileRules) {

            const matchingFiles = files.filter(
                file => file.fieldname === fileRule.field
            );

            if (fileRule.required && matchingFiles.length === 0) {
                errors[fileRule.field] = `${fileRule.field} is required`;
                continue;
            }

            // Validate uploaded files
            for (const file of matchingFiles) {

                // File type validation
                if (fileRule.allowedMimeTypes && !fileRule.allowedMimeTypes.includes(file.mimetype)) {
                    errors[fileRule.field] = `${fileRule.field} has invalid file type`;
                }

                // File size validation
                if (fileRule.maxSize && file.size > fileRule.maxSize) {
                    errors[fileRule.field] = `${fileRule.field} exceeds the allowed file size`;
                }
            }
        }

        // Check unexpected files
        const allowedFields = fileRules.map(
            fileRule => fileRule.field
        );

        for (const file of files) {

            if (!allowedFields.includes(file.fieldname)) {
                errors[file.fieldname] = `${file.fieldname} is not allowed for step ${step}`;
            }
        }
        return errors;
    };

}
export default new ValidateStepMiddleware();