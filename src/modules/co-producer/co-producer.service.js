import coProducerRepository from './co-producer.repository.js';
import fileUploadHelper from '../../utills/index.js';
import AppError from "../../utills/AppError.js";
import { WEBSITE_TYPE } from '../../constants/common.constant.js';
import commonRepository from '../common/common.repository.js';

const PRODUCER_DOCUMENT_MAP = Object.freeze([
    'co_producer_id_proof',
    'passport_image'
]);

class CoProducerService {

    async _validateIpForm(payload) {

        const entry = await coProducerRepository.validateIpForm(payload.ip_application_form_id, payload.clientId);
        if (!entry) {
            throw new AppError('Application entries not found.!', 404);
        }

        if (entry.client_id.toString() !== payload.clientId.toString()) {
            throw new AppError('Unauthorized: You can only add/Update co-producers to your own forms', 403);
        }
        return entry;

    }

    async _existingCoProducer(id) {
        const existingCoProducer = await coProducerRepository.findByIdWithDoc(id);
        if (!existingCoProducer) {
            throw new AppError("Co-producer entry not found!!", 404);
        }
        return existingCoProducer;
    }

    async store(payload) {

        const { files } = payload;

        await this._validateIpForm(payload);

        const dataToStore = {
            ip_application_form_id: BigInt(payload.ip_application_form_id),
            type: Boolean(Number(payload.type)),

            name: payload.name,
            email: payload.email,
            mobile: payload.mobile,
            landline: payload.landline ?? null,
            website: payload.website ?? null,
            address: payload.address,

            is_indian_entity: Number(payload.is_indian_entity) ?? null,

            nationality: payload.nationality ?? null,
            registration_details: payload.registration_details ?? null,
            name_of_producers: payload.name_of_producers ?? null,
        };

        const coProducer = await coProducerRepository.create(dataToStore);
        if (!coProducer) {
            throw new AppError('Something went wrong', 400);
        }

        // File 
        if (files?.length > 0) {

            const allowedDocuments = PRODUCER_DOCUMENT_MAP;

            for (const file of files) {
                if (!allowedDocuments.includes(file.fieldname)) {
                    throw new AppError(
                        `Document '${file.fieldname}' is not allowed.`,
                        422
                    );
                }
            }

            const uploaded = await fileUploadHelper.upload({
                ...payload,
                contextId: coProducer.id,
                websiteType: WEBSITE_TYPE.IP,
            });

            if (!uploaded) {
                throw new AppError('Something went wrong during document upload.', 409);
            }
        }

        return coProducer;
    }

    async update(payload) {

        const { id, clientId, files, ip_application_form_id } = payload;

        await this._validateIpForm(payload);

        const existingCoProducer = await this._existingCoProducer(id);

        if (parseInt(existingCoProducer.ip_application_form_id) !== parseInt(ip_application_form_id)) {
            throw new AppError("Unauthorized: This record does not belong to your form.", 403);
        }

        // const existingCoProducer = await coProducerRepository.findByFormId(id);
        // if (!existingCoProducer) {
        //     throw new AppError("Co-producer entry not found!!", 404);
        // }
        // if (parseInt(existingCoProducer.ip_application_form_id) !== parseInt(payload.ip_application_form_id)) {
        //     throw new AppError("Unauthorized: This record does not belong to your form.", 403);
        // }

        const dataToStore = {
            ip_application_form_id: BigInt(payload.ip_application_form_id),
            type: Boolean(Number(payload.type)),
            name: payload.name,
            email: payload.email,
            mobile: payload.mobile,
            landline: payload.landline ?? null,
            website: payload.website ?? null,
            address: payload.address,
            is_indian_entity: Number(payload.is_indian_entity) ?? null,
            nationality: payload.nationality ?? null,
            registration_details: payload.registration_details ?? null,
            name_of_producers: payload.name_of_producers ?? null,
        };

        const coProducerUpdated = await coProducerRepository.updateByFormId(id, dataToStore);

        if (!coProducerUpdated) {
            throw new AppError('Something went wrong during update.!', 409);
        }

        // File allowed or not
        if (files?.length > 0) {

            const allowedDocuments = PRODUCER_DOCUMENT_MAP;

            for (const file of files) {
                if (!allowedDocuments.includes(file.fieldname)) {
                    throw new AppError(
                        `Document '${file.fieldname}' is not allowed.`,
                        422
                    );
                }
            }

            const uploaded = await fileUploadHelper.upload({
                ...payload,
                contextId: coProducerUpdated.id,
                websiteType: WEBSITE_TYPE.IP,
            });

            if (!uploaded) {
                throw new AppError('Something went wrong during document upload.', 409);
            }
        }
        return coProducerUpdated;
    }

    async getForm(id, clientId) {

        const existingCoProducer = await this._existingCoProducer(id);

        const payload = { ip_application_form_id: existingCoProducer.ip_application_form_id, clientId };
        const ipApplication = await this._validateIpForm(payload);
        if (parseInt(existingCoProducer.ip_application_form_id) !== parseInt(ipApplication.id)) {
            throw new AppError("Unauthorized: This record does not belong to your form.", 403);
        }

        return existingCoProducer;
    }

    async deleteCoProducerById(id, clientId) {

        const existingCoProducer = await this.getForm(id, clientId);
                
        const deleted = await coProducerRepository.delete(existingCoProducer.id);

        // Delete all local files if documents exist
        if (deleted) {

            const { documents } = existingCoProducer;

            if (documents.length) {
                
                await Promise.all(
                    documents.map(docuemt => fileUploadHelper.removeLocally(docuemt))
                );

                // Delete all document records from DB
                await commonRepository.deleteMany(
                    documents.map(doc => Number(doc.id))
                );
            }
        }
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

export default new CoProducerService();