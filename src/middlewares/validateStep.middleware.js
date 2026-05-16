import ipValidator from "../validations/ip.validator.js";
import validateRequest from "./validateRequest.js";
import constant from '../constants/constant.js';
import AppError from "../utills/AppError.js";

class ValidateStepMiddleware {

    // validateByStep(req, res, next) {
    //     const step = parseInt(req.body.step);
    //     if (!step) {
    //         return res.status(400).json({
    //             status: false,
    //             message: "Validation error",
    //             errors: {
    //                 step: "step is required"
    //             }
    //         });
    //     }
    //     const schema = ipValidator.getSchemaForStep(step);
    //     return validateRequest(schema)(req, res, next);
    // }

    validateByStep(req, res, next) {
        try {
            const { step } = req.body;

            if (!step) {
                return res.status(400).json({
                    status: false,
                    message: "Validation error",
                    errors: {
                        step: "step is required"
                    }
                });
            }

            const validSteps = Object.values(constant.FORM_STEPS);
            if (!validSteps.includes(Number(step))) {
                return res.status(400).json({
                    status: false,
                    message: "Validation error",
                    errors: {
                        step: `step must be one of: ${validSteps.join(', ')}`
                    }
                });
            }

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

}
export default new ValidateStepMiddleware();