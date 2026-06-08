import { transporter } from '../utills/transporter.js';
import { fileURLToPath } from 'url';
import path from 'path';
import ejs from 'ejs';
import { config } from '../configs/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendMail = async ({ to, subject, templateName, context }) => {
    try {

        const templatePath = path.join(__dirname, "templates", templateName);
        const html = await ejs.renderFile(templatePath, context);
       
        await transporter.verify();
        await transporter.sendMail({
            from: `"IFFI Goa" <${config.email.from}>`,
            to,
            subject,
            html,
        });

        console.log("Mail sent to", to);
        return true;
    } catch (err) {
        console.error("Mail send error:", err);
        return false;
    }
};