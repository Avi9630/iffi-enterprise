import nodemailer from 'nodemailer';
import { config } from '../configs/index.js';

export const transporter = nodemailer.createTransport({
    host: config.email.smtp.host,//process.env.MAIL_HOST,
    port: config.email.smtp.port || 587,
    secure: false,
    auth: {
        user: config.email.smtp.auth.username,
        pass: config.email.smtp.auth.password,
    },
});