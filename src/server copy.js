import { config, database, logger } from "../src/configs/index.js"
import prisma from './configs/prisma.js'
import app from "./app.js";
// import env from "./configs/env.js";
// import dotenv from 'dotenv';
// dotenv.config();

const PORT = config.port;

async function startServer() {
    try {

        await prisma.$connect();
        logger.info('✅ Database connected successfully');

        // Start server
        const server = app.listen(PORT, () => {
            logger.info(`🚀 Server running on port ${PORT} in ${env.NODE_ENV} mode`);
        });

        const gracefulShutdown = async (signal) => {

            logger.info(`${signal} received. Starting graceful shutdown...`);

            server.close(async () => {
                logger.info('HTTP server closed');

                try {
                    await prisma.$disconnect();
                    logger.info('Database connection closed');
                    process.exit(0);
                } catch (error) {
                    logger.error('Error during shutdown', { error: error.message });
                    process.exit(1);
                }
            });

            setTimeout(() => {
                logger.error('Could not close connections in time, forcefully shutting down');
                process.exit(1);
            }, 10000);
        };

        // Event handlers
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        process.on('unhandledRejection', (reason, promise) => {
            logger.error('Unhandled Rejection:', { promise, reason });
            gracefulShutdown('unhandledRejection');
        });
        process.on('uncaughtException', (error) => {
            logger.error('Uncaught Exception:', { error: error.message, stack: error.stack });
            gracefulShutdown('uncaughtException');
        });

    } catch (error) {
        logger.error('❌ Failed to start server', {
            error: error.message,
            stack: error.stack
        });
        process.exit(1);
    }
}

startServer();