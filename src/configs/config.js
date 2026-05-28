import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import path from 'path';
import Joi from "joi";

const NODE_ENV = process.env.NODE_ENV ?? 'development';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, `../../.env.${NODE_ENV}`), quiet: true });

// dotenv.config();

const envSchema = Joi.object({

    NODE_ENV: Joi.string().valid('local', 'development', 'production').required('development'),
    PORT: Joi.number().default(3000),

    // /----DATABASE URL ---------------------------------------------------------
    DATABASE_URL: Joi.string().required(),

    // ── Redis ──────────────────────────────────────────────────────────────────
    REDIS_HOST: Joi.string().default('localhost'),
    REDIS_PORT: Joi.number().default(6379),
    REDIS_PASSWORD: Joi.string().allow('').optional(),

    // /----JWT-------------------------------------------------------------------
    JWT_SECRET: Joi.string().required(),
    JWT_ACCESS_TOKEN_EXPIRES_IN: Joi.string().default('1m'),
    JWT_REFERESH_TOKEN_EXPIRES_IN: Joi.string().required('10d'),
    JWT_ACTIVATION_TOKEN_EXPIRES_IN: Joi.string().default('10m'),
    BCRYPT_ROUNDS: Joi.number().default(10),
    BCRYPT_SALT_ROUNDS: Joi.number().default(12),

    // ── Email ─────────────────────────────────────────────────────────────────
    SMTP_HOST: Joi.string().allow('').optional(),
    SMTP_PORT: Joi.number().allow(null).optional(),
    SMTP_USERNAME: Joi.string().allow('').optional(),
    SMTP_PASSWORD: Joi.string().allow('').optional(),
    EMAIL_FROM: Joi.string().allow('').optional(),

    // ── BillDesk ──────────────────────────────────────────────────────────────
    BILLDESK_MERCHANT_ID: Joi.string().allow('').optional(),
    BILLDESK_CLIENT_ID: Joi.string().allow('').optional(),
    BILLDESK_KEY_ID: Joi.string().allow('').optional(),
    BILLDESK_ENCRYPTION_KEY: Joi.string().allow('').optional(),
    BILLDESK_SIGNING_KEY: Joi.string().allow('').optional(),
    BILLDESK_BASE_URL: Joi.string().default('https://uat1.billdesk.com/u2/payments/ve1_2'),
    BILLDESK_RETURN_URL: Joi.string().allow('').optional(),

    // /--RECAPTCHA_SECRET_KEY---------------------------------------------------
    RECAPTCHA_SECRET_KEY: Joi.string().required(),

    // /--RECAPTCHA_SECRET_KEY---------------------------------------------------
    BASE_PATH: Joi.string().optional(),

})
    .unknown(true)
    .options({ errors: { label: 'key' } });

const { error, value: env } = envSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const config = {

    env: env.NODE_ENV,
    port: env.PORT,

    recaptchaSecretKey: env.RECAPTCHA_SECRET_KEY,
    databaseUrl: env.DATABASE_URL,
    basePath: env.BASE_PATH,
    frontendUrl: env.FRONTEND_URL,

    redis: {
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        password: env.REDIS_PASSWORD || undefined,
    },

    jwt: {
        secret: env.JWT_SECRET,
        jwtAccessTokenExpiresIn: env.JWT_ACCESS_TOKEN_EXPIRES_IN,
        jwtRefereshTokenExpiresIn: env.JWT_REFERESH_TOKEN_EXPIRES_IN,
        jwtActivationTokenExpiresIn: env.JWT_ACTIVATION_TOKEN_EXPIRES_IN,
        bryptRounds: env.BCRYPT_ROUNDS,
        bryptSaltRounds: env.BCRYPT_SALT_ROUNDS
    },

    email: {
        smtp: {
            host: env.SMTP_HOST,
            port: env.SMTP_PORT,
            auth: {
                username: env.SMTP_USERNAME,
                password: env.SMTP_PASSWORD,
            },
        },
        from: env.EMAIL_FROM,
    },

    billdesk: {
        merchantId: env.BILLDESK_MERCHANT_ID,
        clientId: env.BILLDESK_CLIENT_ID || env.BILLDESK_MERCHANT_ID,
        keyId: env.BILLDESK_KEY_ID || env.BILLDESK_MERCHANT_ID,
        encryptionKey: env.BILLDESK_ENCRYPTION_KEY || env.BILLDESK_SIGNING_KEY,
        signingKey: env.BILLDESK_SIGNING_KEY,
        baseUrl: env.BILLDESK_BASE_URL,
        returnUrl: env.BILLDESK_RETURN_URL,
    },
};