import { AppError } from '../../utills/index.js';
import { database, logger } from '../../configs/index.js';
import { redisClient } from "../../configs/index.js";
import BaseRepository from '../shared/base.repository.js';

const prisma = database.client;

// const CACHE_TTL = 3600; // 1 hour in seconds
const CACHE_TTL = 300; // 5 mint in seconds

class CommonRepository extends BaseRepository {

    // async _getCached(key, fetchFn, ttl = CACHE_TTL) {

    //     const redis = redisClient.getClient();
    //     const cached = await redis.get(key);

    //     if (cached) {
    //         return JSON.parse(cached);
    //     }

    //     const data = await fetchFn();
    //     await redis.set(
    //         key,
    //         JSON.stringify(
    //             data,
    //             (_, value) => typeof value === 'bigint' ? value.toString() : value),
    //         'EX',
    //         ttl
    //     );

    //     return data;
    // }

    // async getModel(modelName) {
    //     const model = prisma[modelName];
    //     if (!model || typeof model.findMany !== 'function') {
    //         throw new Error(`Prisma model "${modelName}" not found. Check your schema.prisma.`);
    //     }
    //     return model;
    // }

    async clientList(){
        const clientModel = await this.getModel('clients');
        return clientModel.findMany();
    }

    async clientTypeList() {
        return this._getCached('client_types', async () => {
            const model = await this.getModel('client_types');
            return model.findMany();
        });
    }

    async genreList() {
        return this._getCached('genres', async () => {
            const model = await this.getModel('genres');
            return model.findMany();
        });
    }

    async countryList() {
        return this._getCached('countries', async () => {
            const model = await this.getModel('countries');
            return model.findMany();
        });
    }

    async stateList() {
        return this._getCached('states', async () => {
            const model = await this.getModel('states');
            return model.findMany({ orderBy: { name: 'asc' } });
        });
    }

    async cityListWithState(stateId) {
        return this._getCached(`cities_${stateId}`, async () => {
            const model = await this.getModel('cities');
            return model.findMany({
                where: { state_id: parseInt(stateId) },
                orderBy: { city: 'asc' }
            });
        });
    }

    async cityList() {
        return this._getCached('cities', async () => {
            const model = await this.getModel('cities');
            return model.findMany();
        });
    }

    async languageList() {
        return this._getCached('languages', async () => {
            const model = await this.getModel('languages');
            return model.findMany();
        });
    }

    // async saveAndUpdate(criteria, data) {
    //     try {

    //         const existingDocument = await prisma.documents.findFirst({
    //             where: {
    //                 context_id: criteria.context_id,
    //                 website_type: criteria.website_type,
    //                 document_type: criteria.document_type,
    //             }
    //         });

    //         let document;
    //         if (existingDocument) {
    //             // Update karo
    //             document = await prisma.documents.update({
    //                 where: { id: existingDocument.id },
    //                 data: data
    //             });
    //         } else {
    //             // Create karo
    //             document = await prisma.documents.create({
    //                 data: { ...criteria, ...data }
    //             });
    //         }

    //         return {
    //             success: true,
    //             data: document
    //         };
    //     } catch (error) {
    //         console.error('Error in saveAndUpdate:', error);
    //         return {
    //             success: false,
    //             error: error.message
    //         };
    //     }
    // }

    // async checkExisting(criteria) {
    //     return await prisma.documents.findFirst({
    //         where: {
    //             context_id: criteria.context_id,
    //             website_type: criteria.website_type,
    //             document_type: criteria.document_type
    //         }
    //     });
    // }

    // async deleteMany(ids) {
    //     try {
    //         return await prisma.documents.deleteMany({
    //             where: {
    //                 id: { in: ids }
    //             }
    //         });
    //     } catch (error) {
    //         if (error.code === 'P2025') {
    //             throw new AppError('Documents not found.', 404);
    //         }
    //         throw new AppError('Failed to delete documents.', 500);
    //     }
    // }

}
export default new CommonRepository();