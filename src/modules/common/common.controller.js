import { redisClient } from "../../configs/index.js";
import { ApiResponse } from "../../utills/index.js";
import commonRepository from "./common.repository.js";

class CommonController {

    async masterData(req, res, next) {
        try {

            const { type } = req.params;
            
            const handlers = {
                'client-list': () => commonRepository.clientList(),
                'client-type-list': () => commonRepository.clientTypeList(),
                'language-list': () => commonRepository.languageList(),
                'genre': () => commonRepository.genreList(),
                'country': () => commonRepository.countryList(),
                'state': () => commonRepository.stateList(),
                'city': () => {
                    const { state_id } = req.query;
                    if (!state_id) {
                        throw new AppError('state_id is required for city list.!', 400);
                    }
                    return commonRepository.cityList(state_id);
                }
            };

            const handler = handlers[type];

            if (!handler) {
                throw new AppError('Invalid master data type.!', 400);
            }

            const data = await handler();

            return ApiResponse(res, 200, {
                message: "Success.!",
                data
            });

        } catch (error) {
            next(error);
        }
    }

}

export default new CommonController();