import Joi from "joi";
import dotenv from 'dotenv';

const envSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),
    PORT: Joi.number().default(3000),
    DATABASE_URL: Joi.string().required(),
    JWT_SECRET: Joi.string().min(32).required(),
    JWT_EXPIRES_IN: Joi.string().default('7d'),
    BCRYPT_ROUNDS: Joi.number().default(10),
}).unknown();

const { error, value: env } = envSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export default env;