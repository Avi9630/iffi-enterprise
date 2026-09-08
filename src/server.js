import { config, database, logger, redisClient } from "./configs/index.js"
import app from "./app.js";

const PORT = config.port;

const start = async () => {

    await database.connect();       // DATABASE CONNECTION;
    await redisClient.connect();    // RedisConnect();

    // START HTTP SERVER
    const server = app.listen(PORT, () => {
        logger.info(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
    });

    // SHUTDOWN DATABASE CONNECTIONS ON EXIT;
    const shutdown = async (signal) => {
            
        logger.info(`${signal} received — shutting down gracefully`);
        
        server.close(async () => {

            await database.disconnect();
            await redisClient.disconnect();
            
            logger.info('Server closed');
            process.exit(0);
        });

        setTimeout(() => {
            logger.error('Forced shutdown after timeout');
            process.exit(1);
        }, 10_000);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

    process.on('unhandledRejection', (err) => {
        logger.error(`Unhandled rejection: ${err.message}`);
        server.close(() => process.exit(1));
    });
}
start();