import coProducerRepository from './ip-film-festival.repository.js';
import fileUploadHelper from '../../utills/index.js';
import AppError from "../../utills/AppError.js";
import { WEBSITE_TYPE } from '../../constants/common.constant.js';
import commonRepository from '../common/common.repository.js';
import ipFilmFestivalRepository from './ip-film-festival.repository.js';

const PRODUCER_DOCUMENT_MAP = Object.freeze([
    'co_producer_id_proof',
    'passport_image'
]);

class IpFilmFestivalService {

    async _validateIpForm(payload) {

        const ipEntry = await ipFilmFestivalRepository.validateIpForm(payload.ip_application_form_id, payload.clientId);
        if (!ipEntry) {
            throw new AppError('Application entries not found.!', 404);
        }

        if (ipEntry.client_id.toString() !== payload.clientId.toString()) {
            throw new AppError('Unauthorized: You can only add/Update co-producers to your own forms', 403);
        }
        return ipEntry;

    }

    async _existingFilmFestival(id) {

        const existingFilmFestival = await ipFilmFestivalRepository.findByFormId(id);
        if (!existingFilmFestival) {
            throw new AppError("Film festival entry not found!!", 404);
        }
        return existingFilmFestival;
    }

    async store(payload) {

        await this._validateIpForm(payload);

        const dataToStore = {
            ip_application_form_id: BigInt(payload.ip_application_form_id),
            name_of_festival: payload.name_of_festival,
            address_of_festival: payload.address_of_festival,
            date_of_festival: new Date(payload.date_of_festival),
        };

        const filmFestival = await ipFilmFestivalRepository.create(dataToStore);
        if (!filmFestival) {
            throw new AppError('Something went wrong', 400);
        }

        return filmFestival;
    }

    async update(payload) {

        const { id, clientId, ip_application_form_id } = payload;

        await this._validateIpForm(payload);
        const existingFilmFestival = await this._existingFilmFestival(id);

        if (parseInt(existingFilmFestival.ip_application_form_id) !== parseInt(ip_application_form_id)) {
            throw new AppError("Unauthorized: This record does not belong to your form.", 403);
        }

        const dataToUpdate = {
            ip_application_form_id: BigInt(payload.ip_application_form_id),
            name_of_festival: payload.name_of_festival,
            address_of_festival: payload.address_of_festival,
            date_of_festival: new Date(payload.date_of_festival),
        };

        const filmFestivalUpdated = await ipFilmFestivalRepository.updateByFormId(id, dataToUpdate);

        if (!filmFestivalUpdated) {
            throw new AppError('Something went wrong during update.!', 409);
        }

        return filmFestivalUpdated;
    }

    async getForm(id, clientId) {

        const existingIpFilmFestival = await this._existingFilmFestival(id);

        const payload = { ip_application_form_id: existingIpFilmFestival.ip_application_form_id, clientId };
        const ipApplication = await this._validateIpForm(payload);

        if (parseInt(existingIpFilmFestival.ip_application_form_id) !== parseInt(ipApplication.id)) {
            throw new AppError("Unauthorized: This record does not belong to your form.", 403);
        }

        return existingIpFilmFestival;
    }

    async deleteFilmFestival(id, clientId) {
        const existingFilmFestival = await this.getForm(id, clientId);
        return await ipFilmFestivalRepository.delete(existingFilmFestival.id);
    }

    // async getFormByIpApplication(id, clientId) {

    //     const form = await ipRepository.findById(id, clientId);
    //     if (!form) {
    //         throw new AppError('Co-producer entry not belongs to you.!', 404);
    //     }

    //     const existingCoProducer = await coProducerRepository.getAllCoProducerByIpFormId(id);
    //     if (!existingCoProducer) {
    //         throw new AppError("Co-producer entry not found!!", 404);
    //     }

    //     return existingCoProducer;
    // }

}

export default new IpFilmFestivalService();