import { AppError } from '../../utills/index.js';
import { database, logger } from '../../configs/index.js';
import { redisClient } from "../../configs/index.js";

const prisma = database.client;

const CACHE_TTL = 3600; // 1 hour in seconds
const cache = new Map();

class CommonRepository {

    async clientList() {
        return this._getCached('clients', () =>
            prisma.clients.findMany()
        );
    }

    async clientTypeList() {
        // return await prisma.client_types.findMany();
        return this._getCached('ip_types', () =>
            prisma.ip_types.findMany()
        );
    }

    async languageList() {
        return this._getCached('languages', () =>
            prisma.languages.findMany()
        );
    }

    async genreList() {
        return this._getCached('genres', () =>
            prisma.genres.findMany()
        );
    }

    async countryList() {
        return this._getCached('countries', () =>
            prisma.countries.findMany({
                // select: {
                //     id: true,
                //     name: true,
                //     code: true,
                //     // Select only needed fields
                // }
            })
        );
    }

    async stateList(countryId) {
        return this._getCached('states', () =>
            prisma.states.findMany({
                // where: { country_id: parseInt(countryId) },
                orderBy: {
                    name: 'asc'
                }
                // select: {
                //     id: true,
                //     name: true,
                //     country_id: true
                // }
            })
        );
    }

    async cityList(stateId) {
        return this._getCached(`cities_${stateId}`, () =>
            prisma.cities.findMany({
                where: { state_id: parseInt(stateId) },
                orderBy: {
                    city: 'asc'
                }
                // select: {
                //     id: true,
                //     name: true,
                //     state_id: true
                // }
            })
        );
    }

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
}
export default new CommonRepository();