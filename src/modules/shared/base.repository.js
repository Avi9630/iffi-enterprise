import { database } from '../../configs/index.js';
import { redisClient } from '../../configs/index.js';

const prisma = database.client;
const CACHE_TTL = 300;

class BaseRepository {

    async getModel(modelName) {
        const model = prisma[modelName];
        if (!model || typeof model.findMany !== 'function') {
            throw new Error(`Prisma model "${modelName}" not found.`);
        }
        return model;
    }

    async _getCached(key, fetchFn, ttl = CACHE_TTL) {
        
        console.log('Key is : ', key);
        console.log('Function is : ', fetchFn);
        
        const redis = redisClient.getClient();
        const cached = await redis.get(key);

        if (cached) return JSON.parse(cached);

        const data = await fetchFn();
        await redis.set(
            key,
            JSON.stringify(data, (_, v) => typeof v === 'bigint' ? v.toString() : v),
            'EX',
            ttl
        );
        return data;
    }

    async _invalidateCache(...keys) {
        const redis = redisClient.getClient();
        if (keys.length) await redis.del(...keys);
    }
}

export default BaseRepository;