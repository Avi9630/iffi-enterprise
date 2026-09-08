import documentRepository from '../../queries/document.repository.js';
import ipRepository from '../../modules/ip-app/ip.repository.js';
import { IP_STEP_DOCUMENT_MAP, IP_STEP_FIELD_MAP, WEBSITE_TYPE } from '../../constants/index.js';
import fileUploadHelper from '../../utills/index.js';
import AppError from "../../utills/AppError.js";

const NUMERIC_FIELDS = new Set([
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
    'year',
    'eligible_for_horizons',
    'confirmation_neither_released_nor_planned',
    'is_ip_award',
    'enclosed_the_declaration_letter',
    'status',
]);

const BOOLEAN_FIELDS = new Set([
    'status',
]);

class IpService {

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

        const { id, client, files } = payload;
        const existingForm = await this._checkExists(id, client.id);

        if (existingForm.step === 9) {
            throw new AppError("Changes not allowed.! Form already submitted.", 403);
        }

        const currentStep = parseInt(payload.step, 10);
        const stepFields = IP_STEP_FIELD_MAP[currentStep] || [];

        let dataToUpdate = {
            client_id: payload.client.id,
            step: currentStep,
        };

        stepFields.forEach(field => {
            dataToUpdate[field] = payload[field] ?? null;
        });

        if (!existingForm.active_step || existingForm.active_step < currentStep) {
            dataToUpdate.active_step = currentStep;
        }

        if (dataToUpdate.step === 5) {
            dataToUpdate = this._convertDateFields(dataToUpdate, ['date_of_cbfc_certificate', 'date_of_completion_production']);
        }

        if (dataToUpdate.step === 9) {
            if (existingForm.payment_status !== 1) {
                throw new AppError("Your payment has not been completed yet.! Please wait till payment success.!.", 403);
            }
            dataToUpdate.status = true
        }

        // Sanitize all data types before sending to Prisma const
        const sanitizedData = await this._sanitizePayload(dataToUpdate);

        const dbData = await ipRepository.updateById(payload.id, sanitizedData);
        if (!dbData) {
            throw new AppError('Something went wrong during update.!', 409);
        }

        // File allowed or not
        if (files?.length > 0) {

            const allowedDocuments = IP_STEP_DOCUMENT_MAP[currentStep] || [];

            for (const file of files) {
                if (!allowedDocuments.includes(file.fieldname)) {
                    throw new AppError(
                        `Document '${file.fieldname}' is not allowed for step ${currentStep}`,
                        422
                    );
                }
            }

            const uploaded = await fileUploadHelper.upload({
                ...payload,
                contextId: payload.id,
                websiteType: WEBSITE_TYPE.IP,
            });

            if (!uploaded) {
                throw new AppError('Something went wrong during document upload.', 409);
            }
        }
        return dbData;
    }

    async getForm(id, clientId) {

        await this._checkExists(id, clientId);
        const entry = await ipRepository.getByAllSub(id, clientId);
        return entry;
    }

    async deleteFormById(id, clientId) {

        await this.checkExists(id, clientId);

        const entry = await ipRepository.getByAllSub(id, clientId);

        const deleted = await ipRepository.delete(id, clientId);

        if (deleted) {

            const { documents } = entry;

            if (documents.length) {

                await Promise.all(documents.map(docuemt => fileUploadHelper.removeLocally(docuemt)));
                await ipRepository.deleteMany(
                    documents.map(doc => Number(doc.id))
                );
            }
        }
    }

    async _checkExists(id, clientId) {

        const existingEntry = await ipRepository.getById(id, clientId);

        if (!existingEntry) {
            throw new AppError('Entry not found.!', 404);
        }

        if (existingEntry.client_id.toString() !== clientId.toString()) {
            throw new AppError("Unauthorized: You can not see another user's entry.!", 403);
        }

        return existingEntry;
    }

    async _sanitizePayload(data) {
        const sanitized = {};

        for (const [key, value] of Object.entries(data)) {
            if (value === undefined) continue;

            if (value === null) {
                sanitized[key] = null;
                continue;
            }

            if (BOOLEAN_FIELDS.has(key)) {
                sanitized[key] = Boolean(value);  // 1→true, 0→false, true→true
            } else if (NUMERIC_FIELDS.has(key)) {
                const parsed = parseInt(value, 10);
                sanitized[key] = isNaN(parsed) ? null : parsed;
            } else {
                sanitized[key] = value;
            }
        }
        return sanitized;
    }

    _convertDateFields(data, dateFields = []) {
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
