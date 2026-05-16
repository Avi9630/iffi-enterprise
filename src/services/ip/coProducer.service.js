import coProducerRepository from '../../queries/ip/coProducer.repository.js';
import ipRepository from "../../queries/ip/ip.repository.js";
import documentRepository from '../../queries/document.repository.js';
import fileUploadService from '../fileUpload.service.js';
import AppError from "../../utills/AppError.js";

class CoProducerService {

    async store(payload) {

        const form = await ipRepository.findById(payload.ip_application_form_id, payload.clientId);
        if (!form) {
            throw new AppError('Form not found. Please enter valid application Id', 404);
        }

        if (form.client_id.toString() !== payload.clientId.toString()) {
            throw new AppError('Unauthorized: You can only add co-producers to your own forms', 403);
        }

        const dataToStore = {
            ip_application_form_id: BigInt(payload.ip_application_form_id),
            co_producer_is: Number(payload.co_producer_is),

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

        if (payload.files && Object.keys(payload.files).length > 0) {
            const fileData = {
                ...payload,
                contextId: coProducer.id
            }
            const fileupload = await fileUploadService.upload(fileData);
            if (!fileupload) {
                throw new AppError('Something went wrong during upload document.!', 409);
            }
        }
        return coProducer;
    }

    async update(payload) {

        const form = await ipRepository.findById(payload.ip_application_form_id, payload.clientId);
        if (!form) {
            throw new AppError('Form not found. Please enter valid application Id', 404);
        }

        const existingCoProducer = await coProducerRepository.findByFormId(payload.id);
        if (!existingCoProducer) {
            throw new AppError("Co-producer entry not found!!", 404);
        }

        if (parseInt(existingCoProducer.ip_application_form_id) !== parseInt(payload.ip_application_form_id)) {
            throw new AppError("Unauthorized: This record does not belong to your form.", 403);
        }

        const dataToStore = {
            ip_application_form_id: BigInt(payload.ip_application_form_id),
            co_producer_is: Number(payload.co_producer_is),
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

        const dbData = await coProducerRepository.updateByFormId(payload.id, dataToStore);

        if (!dbData) {
            throw new AppError('Something went wrong during update.!', 409);
        }

        if (payload.files && Object.keys(payload.files).length > 0) {
            const fileData = {
                ...payload,
                contextId: existingCoProducer.id
            }
            const fileupload = await fileUploadService.upload(fileData);
            if (!fileupload) {
                throw new AppError('Something went wrong during upload document.!', 409);
            }
        }
        return dbData;
    }

    async getFormById(id, clientId) {

        const existingCoProducer = await coProducerRepository.findByIdWithDoc(id);
        if (!existingCoProducer) {
            throw new AppError("Co-producer entry not found!!", 404);
        }

        const form = await ipRepository.findById(existingCoProducer.ip_application_form_id, clientId);
        if (!form) {
            throw new AppError('Co-producer entry not belongs to you.!', 404);
        }

        return existingCoProducer;
    }

    async getFormByIpApplication(id, clientId) {

        const form = await ipRepository.findById(id, clientId);
        if (!form) {
            throw new AppError('Co-producer entry not belongs to you.!', 404);
        }

        const existingCoProducer = await coProducerRepository.getAllCoProducerByIpFormId(id);
        if (!existingCoProducer) {
            throw new AppError("Co-producer entry not found!!", 404);
        }

        return existingCoProducer;
    }

    async deleteCoProducerById(id, clientId) {

        const existingCoProducer = await coProducerRepository.findByIdWithDoc(id);
        if (!existingCoProducer) {
            throw new AppError("Co-producer entry not found!!", 404);
        }

        const form = await ipRepository.findById(existingCoProducer.ip_application_form_id, clientId);

        if (!form) {
            throw new AppError("Unauthorized: This record does not belong to your form.", 403);
        }

        const deleted = await coProducerRepository.delete(existingCoProducer.id);

        // Delete all local files if documents exist
        if (deleted) {

            const { documents } = existingCoProducer;
            
            if (documents.length) {
                await Promise.all(
                    documents.map(docuemt => fileUploadService.removeLocally(docuemt))
                );

                // Delete all document records from DB
                await documentRepository.deleteMany(
                    documents.map(doc => Number(doc.id))
                );
            }
        }
    }

}

export default new CoProducerService();