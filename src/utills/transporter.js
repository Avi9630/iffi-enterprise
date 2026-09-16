import { config } from '../configs/index.js';
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    host: config.email.smtp.host || 'smtp.gmail.com',   //process.env.MAIL_HOST,
    port: config.email.smtp.port || 587,
    secure: false,
    auth: {
        user: config.email.smtp.auth.username,
        pass: config.email.smtp.auth.password,
    },
});