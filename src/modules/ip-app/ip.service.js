import documentRepository from '../../queries/document.repository.js';
import ipRepository from '../../modules/ip-app/ip.repository.js';
import { IP_STEP_FIELD_MAP, WEBSITE_TYPE } from '../../constants/index.js';
import fileUploadHelper from '../../utills/index.js';
import AppError from "../../utills/AppError.js";

class IpService {

    async checkExists(id, clientId) {

        const entry = await ipRepository.findById(id, clientId);

        if (!entry) {
            throw new AppError('Entry not found.!', 404);
        }

        if (entry.client_id.toString() !== clientId.toString()) {
            throw new AppError("Unauthorized: You can not see other's entry.!", 403);
        }

        return entry;
    }

    async store(payload) {

        const dataToStore = {
            client_id: payload.client.id,
            step: payload.step,
            active_step: payload.step,
            category: payload.category,
            year: new Date().getFullYear()
        };

        const currentStepFields = IP_STEP_FIELD_MAP[payload.step] || [];

        currentStepFields.forEach(field => {
            if (payload[field] !== undefined) {
                dataToStore[field] = payload[field];
            }
        });
        return await ipRepository.create(dataToStore);
    }

    async update(payload) {

        const existingForm = await ipRepository.getById(payload.id, payload.client.id);

        if (!existingForm) {
            throw new AppError('Entry not found.!', 404);
        }

        if (existingForm.client_id.toString() !== payload.client.id.toString()) {
            throw new AppError("Unauthorized: You can not see other's entry.!", 403);
        }

        const currentStep = parseInt(payload.step, 10);
        const currentStepFields = IP_STEP_FIELD_MAP[currentStep] || [];

        let dataToUpdate = {
            client_id: payload.client.id,
            step: currentStep,
        };

        currentStepFields.forEach(field => {
            dataToUpdate[field] = payload[field] ?? null;
        });

        if (!existingForm.active_step || existingForm.active_step < currentStep) {
            dataToUpdate.active_step = currentStep;
        }

        if (dataToUpdate.step === 5) {
            dataToUpdate = this.convertDateFields(dataToUpdate, [
                'date_of_cbfc_certificate',
                'date_of_completion_production'
            ]);
        }

        // Sanitize all data types before sending to Prisma
        const sanitizedData = await this.sanitizePayload(dataToUpdate);

        const dbData = await ipRepository.updateById(payload.id, sanitizedData);

        if (!dbData) {
            throw new AppError('Something went wrong during update.!', 409);
        }

        if (payload.files && Object.keys(payload.files).length > 0) {
            const fileData = {
                ...payload,
                contextId: payload.id,
                websiteType: WEBSITE_TYPE.IP,
            }
            const fileupload = await fileUploadHelper.upload(fileData);
            if (!fileupload) {
                throw new AppError('Something went wrong during upload document.!', 409);
            }
        }
        return dbData;
    }

    async getClientForms(client_id) {
        return await ipRepository.findByClientId(client_id);
    }

    async getFormById(id, clientId) {

        const entry = await this.checkExists(id, clientId);
        return entry;
    }

    async deleteFormById(id, clientId) {

        const entry = await this.checkExists(id, clientId);
        const deleted = await ipRepository.delete(id);


        // Delete all local files if documents exist
        if (deleted) {

            const { documents } = entry;

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

    async sanitizePayload(data) {
        const sanitized = {};

        for (const [key, value] of Object.entries(data)) {
            if (value === undefined) continue;

            // Convert numeric fields
            if ([
                'step',
                'active_step',
                'category',
                'whether_subtitle_english',
                'dcp',
                'dci_compliant_jpeg_2000',
                'subtitle_to_be_burned_in_picture',
                'dcp_should_cru_hard_disk',
                'hard_disk_format_ext2_ext3',
                'is_dcp_unencrypted',
                'blueray',
                'blueray_region_free_pal',
                'value_of_dcp_or_blueray',
                'pendrive',
                'is_pendrive_containing_hd_files',
                'producer_is',
                'firm_is_owned_by_individual',
                'company_is_registered_as_indian_entity',
                'is_address_same_as_producer',
                'whether_indian_foreign_right_holder_same',
                'director_indian_natinality',
                'film_is_certified_by_cbfc_or_uncensored',
                'film_comletion_during_12month',
                'film_screened',
                'film_broadcast_tv',
                'film_screened_inside_india',
                'film_screened_outside_india',
                'film_participated_compentitaion',
                'is_directore_debute_film',
                'film_distribution_limited_to_india_only',
                'requisite_documents',
                'payment_status',
                'status',
                'year',
                'eligible_for_horizons',
                'confirmation_neither_released_nor_planned',
                'is_ip_award',
                'enclosed_the_declaration_letter',
            ].includes(key)) {
                sanitized[key] = value === null ? null : parseInt(value, 10);
            } else {
                sanitized[key] = value;
            }
        }

        return sanitized;
    };

    convertDateFields(data, dateFields = []) {
        const converted = { ...data };
        dateFields.forEach(field => {
            if (converted[field] && typeof converted[field] === 'string') {
                converted[field] = new Date(converted[field]);
            }
        });
        return converted;
    }

}

export default new IpService();