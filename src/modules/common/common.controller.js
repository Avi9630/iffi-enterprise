import { ApiResponse, AppError } from "../../utills/index.js";
import commonRepository from "./common.repository.js";

class CommonController {

    constructor() {
        this.masterData = this.masterData.bind(this);
        this.handlers = this.handlers.bind(this);
    }

    async masterData(req, res, next) {
        try {

            const { type } = req.params;
            const data = await this.handlers(type, req);
            return ApiResponse(res, 200, { message: "Success.!", data });

        } catch (error) {
            next(error);
        }
    }

    async handlers(type, req) {
        const handle = {
            'client-type-list': () => commonRepository.clientTypeList(),
            'client-list':() => commonRepository.clientList(),
            'language-list': () => commonRepository.languageList(),
            'genre': () => commonRepository.genreList(),
            'country': () => commonRepository.countryList(),
            'state': () => commonRepository.stateList(),

            'city': () => {
                const { state_id } = req.query;

                if (!state_id) {
                    return commonRepository.cityList();
                }

                return commonRepository.cityListWithState(state_id);
            }
        };

        const handler = handle[type];

        if (!handler) {
            throw new AppError('Invalid master data type.!', 400);
        }

        return await handler();
    }


}

export default new CommonController();