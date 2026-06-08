import ApiResponse from "../../utills/ApiResponse.js";
import AppError from "../../utills/AppError.js";
import { WEBSITE_TYPE } from "../../constants/common.constant.js";
import ipFilmFestivalService from "./ip-film-festival.service.js";

class IpFilmFestivalController {

    async addFilmFestival(req, res, next) {
        try {

            const payload = { ...req.body, clientId: req.clientDetails.id };

            const result = await ipFilmFestivalService.store(payload);

            return ApiResponse(res, 201, {
                message: "Ip FIlm Festival added successfully.!",
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async updateFilmFestival(req, res, next) {
        try {

            const { id } = req.params;
            const payload = { ...req.body, clientId: req.clientDetails.id, id };
            
            const result = await ipFilmFestivalService.update(payload);

            return ApiResponse(res, 201, {
                message: "Ip Film festival updated successfully.!",
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getForm(req, res, next) {
        try {
            const { id } = req.params;
            const clientId = req.clientDetails.id;

            const form = await ipFilmFestivalService.getForm(id, clientId);

            return ApiResponse(res, 200, {
                message: "Form retrieved successfully!",
                data: form
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteForm(req, res, next) {
        try {
            const { id } = req.params;
            const clientId = req.clientDetails.id;

            await ipFilmFestivalService.deleteFilmFestival(id, clientId);

            return ApiResponse(res, 200, {
                message: "Film festival deleted successfully!",
            });
        } catch (error) {
            next(error);
        }
    }

    // async masterData(req, res, next) {
    //     try {
    //         const { type, id } = req.params;
    //         const clientId = req.client.id;

    //         const serviceHandlers = {
    //             'self-id': () => coProducerService.getFormById(id, clientId),
    //             'ip-form-id': () => coProducerService.getFormByIpApplication(id, clientId),
    //         };

    //         const handler = serviceHandlers[type];
    //         if (!handler) {
    //             throw new AppError('Invalid master data type!', 400);
    //         }

    //         const data = await handler();

    //         return ApiResponse(res, 200, {
    //             message: "Form retrieved successfully!",
    //             data
    //         });

    //     } catch (error) {
    //         next(error);
    //     }
    // }

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

}

export default new IpFilmFestivalController();
