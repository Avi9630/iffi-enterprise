import { config } from "../../configs/index.js";
import { checkCloseTime } from "../../helpers/index.js";
import ApiResponse from "../../utills/ApiResponse.js"
import AppError from "../../utills/AppError.js";
import ipService from './ip.service.js'

class IpController {

    async addForm(req, res, next) {
        try {

            if (checkCloseTime(config.ipClosingTime)) {
                throw new AppError('IP submission has been closed.', 400);
            }

            const payload = {
                ...req.body,
                client: req.clientDetails
            };

            // console.log(payload);
            // return;

            const result = await ipService.store(payload);

            return ApiResponse(res, 201, {
                message: "Form created successfully!",
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async updateForm(req, res, next) {
        try {

            if (checkCloseTime(config.ipClosingTime)) {
                throw new AppError('IP submission has been closed.', 400);
            }

            const { id } = req.params;
            const payload = {
                ...req.body,
                client: req.clientDetails,
                id,
                files: req.files,
            };
            // console.log(payload);
            // return
            const result = await ipService.update(payload);

            return ApiResponse(res, 200, {
                message: "Form updated successfully!",
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
            const form = await ipService.getFormById(id, clientId);

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

            await ipService.deleteFormById(id, clientId);

            return ApiResponse(res, 200, {
                message: "Entry deleted successfully!",
            });
        } catch (error) {
            next(error);
        }
    }

    async getClientForms(req, res, next) {
        try {
            const client_id = req.client.id;
            const forms = await ipService.getClientForms(client_id);

            return ApiResponse(res, 200, {
                message: "Forms retrieved successfully!",
                data: forms
            });
        } catch (error) {
            next(error);
        }
    }

}

export default new IpController();
