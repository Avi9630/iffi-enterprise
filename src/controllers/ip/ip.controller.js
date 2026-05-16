import fileUploadService from "../../services/fileUpload.service.js";
import ipService from "../../services/ip/ip.service.js";
import ApiResponse from "../../utills/ApiResponse.js";
import constant from "../../constants/constant.js";

class IpController {

    async addForm(req, res, next) {
        try {
            const payload = {
                ...req.body,
                client: req.client
            };

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
            const { id } = req.params;
            const payload = {
                ...req.body,
                client: req.client,
                id,
                files: req.files,
                websiteType: constant.WEBSITE_TYPE.IP,
            };

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
            const clientId = req.client.id;

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
            const clientId = req.client.id;

            await ipService.deleteFormById(id, clientId);

            return ApiResponse(res, 200, {
                message: "Form deleted successfully!",
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
