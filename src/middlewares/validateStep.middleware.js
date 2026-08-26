import ipValidator from "../modules/ip-app/ip.validator.js";
import validateRequest from "./validate.middleware.js";
import { IP_FORM_STEPS } from "../constants/index.js";
import AppError from "../utills/index.js";

class ValidateStepMiddleware {

    constructor() {
        this.validateByStep = this.validateByStep.bind(this);
    }

    async validateByStep(req, res, next) {
        try {
            const { step } = req.body;

            if (!step) {
                return res.status(422).json({
                    status: false,
                    message: "Validation failed!",
                    errors: {
                        step: "step is required.!"
                    }
                });
            }

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

            // const fileErrors = this.validateFiles(Number(step), req.files || []);
            // if (Object.keys(fileErrors).length > 0) {
            //     return res.status(400).json({
            //         status: false,
            //         message: "Validation error",
            //         errors: fileErrors
            //     });
            // }

            const schema = ipValidator.getSchemaForStep(Number(step));

            // if (!schema) {
            //     throw new AppError("Validation error", 400, {
            //         step: `No validation schema defined for step ${step}`
            //     });
            // }

            return validateRequest(schema)(req, res, next);

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

    validateFiles(step, files = []) {

        const fileRules = {
            [IP_FORM_STEPS.PRODUCERS_DETAILS]: [
                'producer_id_proof'
            ],

            // [IP_FORM_STEPS.DIRECTORS_DETAILS]: [
            //     'director_id_proof'
            // ],

            // Example future steps
            [IP_FORM_STEPS.CBFC_CERTIFICATION]: [
                'file_cbfc_certificate',
                'declaration_clause_file',
                'uncensored_file'
            ],

            [IP_FORM_STEPS.DOCUMENTS]: [
                'authorization_latter',
                'declaration_latter',
                'synopsis_in_english',
                'directors_profile',
                'producers_profile',
                'details_of_cast_crew',
            ]
        };

        const requiredFiles = fileRules[step] || [];

        const errors = {};

        requiredFiles.forEach(field => {

            const exists = files.some(
                file => file.fieldname === field
            );

            if (!exists) {
                errors[field] = `${field} is required`;
            }

        });

        return errors;
    }

}
export default new ValidateStepMiddleware();