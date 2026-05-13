import ApiResponse from "../../utills/ApiResponse.js";

class IpController {
    async addForm(req, res, next) {
        try {
            console.log(req);
            
            return ApiResponse(res, 200, {
                message: "Form initiate.!",
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new IpController();