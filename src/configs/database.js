import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

import logger from './logger.js';
import { config } from './config.js';

class Database {

    constructor() {

        this.isConnected = false;

        const adapter = new PrismaMariaDb(config.databaseUrl);

        this.prisma = new PrismaClient({ adapter });

        this.initializeShutdownEvents();
    }

    async connect() {

        if (this.isConnected) {
            return this.prisma;
        }

        try {

            await this.prisma.$connect();

            this.isConnected = true;

            logger.info('✅ Database connected successfully');

            return this.prisma;

        } catch (error) {

            logger.error('❌ Database connection failed', {
                error: error.message,
                stack: error.stack
            });

            process.exit(1);
        }
    }

    async disconnect() {

        if (!this.isConnected) {
            return;
        }

        try {

            await this.prisma.$disconnect();

            this.isConnected = false;

            logger.info('✅ Database disconnected successfully');

        } catch (error) {

            logger.error('❌ Error disconnecting database', {
                error: error.message
            });
        }
    }

    initializeShutdownEvents() {

        process.on('SIGINT', async () => {

            logger.info('SIGINT received');

            await this.disconnect();

            process.exit(0);
        });

        process.on('SIGTERM', async () => {

            logger.info('SIGTERM received');

            await this.disconnect();

            process.exit(0);
        });

        process.on('beforeExit', async () => {

            await this.disconnect();
        });

        process.on('unhandledRejection', async (reason) => {

            logger.error('Unhandled Rejection', {
                reason
            });

            await this.disconnect();

            process.exit(1);
        });

        process.on('uncaughtException', async (error) => {

            logger.error('Uncaught Exception', {
                error: error.message,
                stack: error.stack
            });

            await this.disconnect();

            process.exit(1);
        });
    }

    get client() {
        return this.prisma;
    }
}

export const database = new Database();