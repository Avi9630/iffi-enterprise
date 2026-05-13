import AppError from '../utills/AppError.js';
import prisma from '../configs/prisma.js';

//For frequently accessed data
const CACHE_TTL = 3600; // 1 hour in seconds
const cache = new Map();

class CommonRepository {

    async ipTypeList() {
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
        const cached = cache.get(key);

        if (cached && Date.now() < cached.expiry) {
            return cached.data;
        }

        const data = await fetchFn();
        cache.set(key, {
            data,
            expiry: Date.now() + (ttl * 1000)
        });

        return data;
    }

    clearCache(pattern) {
        if (pattern) {
            for (const key of cache.keys()) {
                if (key.startsWith(pattern)) {
                    cache.delete(key);
                }
            }
        } else {
            cache.clear();
        }
    }
}

export default new CommonRepository();