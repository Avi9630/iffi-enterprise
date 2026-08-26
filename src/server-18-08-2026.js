import { config, database, logger, redisClient } from "./configs/index.js";
import app from "./app.js";

const PORT = config.port;

let server;
let isShuttingDown = false;

const start = async () => {
    try {

        await database.connect();
        await redisClient.connect();

        server = app.listen(PORT, () => {
            logger.info(
                `Server running in ${config.env} mode on port ${PORT}`
            );
        });

    } catch (error) {
        logger.error(`Server startup failed: ${error.message}`);
        process.exit(1);
    }
};

const shutdown = async (signal) => {
        
    if (isShuttingDown) return;

    isShuttingDown = true;

    logger.info(`${signal} received — shutting down gracefully`);

    const forceShutdown = setTimeout(() => {
        logger.error("Forced shutdown after timeout");
        process.exit(1);
    }, 10_000);

    try {
        if (server) {
            await new Promise((resolve) => {
                server.close(resolve);
            });
        }

        await Promise.allSettled([
            database.disconnect(),
            redisClient.disconnect()
        ]);

        clearTimeout(forceShutdown);

        logger.info("Server closed");
        process.exit(0);

    } catch (error) {
        clearTimeout(forceShutdown);

        logger.error(`Shutdown error: ${error.message}`);
        process.exit(1);
    }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("unhandledRejection", (error) => {
    logger.error(`Unhandled rejection: ${error.message}`);
    shutdown("unhandledRejection");
});

process.on("uncaughtException", (error) => {
    logger.error(`Uncaught exception: ${error.message}`);
    shutdown("uncaughtException");
});

start();