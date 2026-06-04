import coProducerService from "./co-producer.service.js";
import ApiResponse from "../../utills/ApiResponse.js";
import AppError from "../../utills/AppError.js";
import { WEBSITE_TYPE } from "../../constants/common.constant.js";

class CoProducerController {

    async addCoProducer(req, res, next) {
        try {

            const payload = {
                ...req.body,
                clientId: req.clientDetails.id,
                files: req.files,
                websiteType: WEBSITE_TYPE.IP,
            };

            console.log(payload);
            return;
            const result = await coProducerService.store(payload);

            return ApiResponse(res, 201, {
                message: "Co-producer(s) added successfully.!",
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async updateCoProducer(req, res, next) {
        try {

            const { id } = req.params;
            const payload = {
                ...req.body,
                client: req.client,
                id,
                files: req.files,
                websiteType: constant.WEBSITE_TYPE.IP,
            };

            // console.log(payload);
            // return;

            const result = await coProducerService.update(payload);

            return ApiResponse(res, 201, {
                message: "Co-producer(s) added successfully.!",
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getForm(req, res, next) {
        try {
            const { id } = req.params;
            const clientId = req.client.id;

            const form = await coProducerService.getFormById(id, clientId);

            return ApiResponse(res, 200, {
                message: "Form retrieved successfully!",
                data: form
            });
        } catch (error) {
            next(error);
        }
    }

    // async bySelf(req, res, next) {
    //     try {
    //         const { id } = req.params;
    //         const clientId = req.client.id;

    //         const form = await coProducerService.getFormById(id, clientId);

    //         return ApiResponse(res, 200, {
    //             message: "Form retrieved successfully!",
    //             data: form
    //         });
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    // async byIpApplication(req, res, next) {
    //     try {
    //         const { id } = req.params;
    //         const clientId = req.client.id;

    //         const form = await coProducerService.getFormById(id, clientId);

    //         return ApiResponse(res, 200, {
    //             message: "Form retrieved successfully!",
    //             data: form
    //         });
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    async masterData(req, res, next) {
        try {
            const { type, id } = req.params;
            const clientId = req.client.id;

            const serviceHandlers = {
                'self-id': () => coProducerService.getFormById(id, clientId),
                'ip-form-id': () => coProducerService.getFormByIpApplication(id, clientId),
            };

            const handler = serviceHandlers[type];
            if (!handler) {
                throw new AppError('Invalid master data type!', 400);
            }

            const data = await handler();

            return ApiResponse(res, 200, {
                message: "Form retrieved successfully!",
                data
            });

        } catch (error) {
            next(error);
        }
    }

    async deleteForm(req, res, next) {
        try {
            const { id } = req.params;
            const clientId = req.client.id;

            await coProducerService.deleteCoProducerById(id, clientId);

            return ApiResponse(res, 200, {
                message: "Co producer deleted successfully!",
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new CoProducerController();
