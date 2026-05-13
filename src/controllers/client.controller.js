import clientService from '../services/client.service.js';
import ApiResponse from '../utills/ApiResponse.js';

class ClientController {

    async clientList(req, res, next) {
        try {
            await clientService.passwordChange(req.body);

            return ApiResponse(res, 200, {
                message: "Password changed successfully.!!",
            });

        } catch (error) {
            return next(error);
        }
    }

}

export default new ClientController();