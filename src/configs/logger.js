import { config } from './config.js';
import winston from 'winston';

const isDev = ['development', 'staging'].includes(config.nodeEnv); //'production'

const jsonFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        let msg = `${timestamp} [${level}]: ${message}`;
        if (Object.keys(meta).length > 0) {
            msg += ` ${JSON.stringify(meta, null, 2)}`;
        }
        return msg;
    })
);

const logger = winston.createLogger({

    level: isDev ? 'debug' : 'info',
    
    format: jsonFormat,

    transports: [

        new winston.transports.Console({
            format: isDev ? consoleFormat : jsonFormat,
        }),

        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            format: jsonFormat,
        }),

        // Combined Logs
        new winston.transports.File({
            filename: 'logs/combined.log',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            format: jsonFormat,
        }),
    ],
});

export default logger;
