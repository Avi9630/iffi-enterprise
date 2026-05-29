import Redis from 'ioredis';
import { config } from './config.js';
import logger from './logger.js';

class RedisClient {

    constructor() {
        this.client = null;
    }

    async connect() {

        if (this.client) {
            return this.client;
        }

        this.client = new Redis({
            host: config.redis.host,
            port: config.redis.port,
            password: config.redis.password || undefined,
            maxRetriesPerRequest: null,
            lazyConnect: true,
        });

        this.client.on('connect', () => {
            logger.info('Redis connected');
        });

        this.client.on('error', (err) => {
            logger.error(err.message);
        });

        this.client.connect(); // IMPORTANT
        return this.client;
    }

    async disconnect() {
        if (this.client) {
            await this.client.quit();
            this.client = null;
            logger.info('Redis disconnected');
        }
    }

    getClient() {
        if (!this.client) {
            return this.connect();
        }
        return this.client;
    }
}

export const redisClient = new RedisClient();
