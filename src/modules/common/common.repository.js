import { AppError } from '../../utills/index.js';
import { database, logger } from '../../configs/index.js';
import { redisClient } from "../../configs/index.js";

const prisma = database.client;

// const CACHE_TTL = 3600; // 1 hour in seconds
const CACHE_TTL = 300; // 5 mint in seconds

class CommonRepository {

    async _getCached(key, fetchFn, ttl = CACHE_TTL) {

        const redis = redisClient.getClient();
        const cached = await redis.get(key);

        if (cached) {
            return JSON.parse(cached);
        }

        const data = await fetchFn();
        await redis.set(
            key,
            JSON.stringify(
                data,
                (_, value) => typeof value === 'bigint' ? value.toString() : value),
            'EX',
            ttl
        );

        return data;
    }

    async getModel(modelName) {
        const model = prisma[modelName];
        if (!model || typeof model.findMany !== 'function') {
            throw new Error(`Prisma model "${modelName}" not found. Check your schema.prisma.`);
        }
        return model;
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

    // async clientList() {
    //     return this._getCached('clients', () =>
    //         prisma.clients.findMany()
    //     );
    // }


    async languageList() {
        return this._getCached('languages', async () => {
            const model = await this.getModel('languages');
            return model.findMany();
        });
    }

    // async genreList() {
    //     return this._getCached('genres', () =>
    //         prisma.genres.findMany()
    //     );
    // }

    // async countryList() {
    //     return this._getCached('countries', () =>
    //         prisma.countries.findMany({
    //             // select: {
    //             //     id: true,
    //             //     name: true,
    //             //     code: true,
    //             //     // Select only needed fields
    //             // }
    //         })
    //     );
    // }

    // async stateList(countryId) {
    //     return this._getCached('states', () =>
    //         prisma.states.findMany({
    //             orderBy: {
    //                 name: 'asc'
    //             }
    //         })
    //     );
    // }

    // async cityListWithState(stateId) {
    //     return this._getCached(`cities_${stateId}`, () =>
    //         prisma.cities.findMany({
    //             where: { state_id: parseInt(stateId) },
    //             orderBy: {
    //                 city: 'asc'
    //             }
    //         })
    //     );
    // }


}
export default new CommonRepository();