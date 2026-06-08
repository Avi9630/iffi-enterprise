import { comparePassword, hashPassword } from '../utills/bcrypt.js';
import clientRepository from '../queries/client.repository.js';
// import { generateToken, verifyToken } from '../utills/jwt.js';
import twoAuthService from './twoAuth.service.js';
import AppError from '../utills/AppError.js';
import { sendMail } from '../mail/mailer.js';


class ClientService {

    async registerClient(payload) {

        const { email, mobile, password, captcha } = payload;

        // Verify captcha (uncomment when live)
        // const captchaResult = await verifyCapcha(captcha);
        // if (!captchaResult.success) {
        //     throw new AppError("Captcha verification failed", 422);
        // }

        // Validation check Email || Mobile
        const existingEmail = await clientRepository.findByEmail(email);
        if (existingEmail) {
            throw new AppError('Email already registered', 409);
        }

        const existingMobile = await clientRepository.findByMobile(mobile);
        if (existingMobile) {
            throw new AppError('Mobile number already registered', 409);
        }

        // Hash password || // Generate activation token
        const hashedPassword = password ? await hashPassword(password) : null;
        const activationToken = await generateToken(email, 'activate_Token');

        const dataToCreate = {
            type_id: payload.type_id,
            first_name: payload.first_name,
            last_name: payload.last_name,
            name: payload.first_name + ' ' + payload.last_name,
            email: payload.email,
            mobile: payload.mobile,
            active: 0,
            password: hashedPassword,
            activate_token: activationToken,
        }

        const client = await clientRepository.create(dataToCreate);

        // Send verification email
        await sendMail({
            to: client.email,
            subject: "Verify Your Registration for IFFI Goa",
            templateName: "registration.ejs",
            context: {
                client_name: client.name,
                frontend_base_url: process.env.FRONTEND_URL,
                activate_token: client.activate_token
            }
        });

        return {
            id: client.id,
            email: client.email,
            name: client.name
        };
    }

    async loginClient(payload) {

        const client = await clientRepository.findByEmail(payload.email);
        if (!client) {
            throw new AppError("Invalid email entered.!!", 404);
        }

        await this.checkActive(payload.email);

        const isMatch = await comparePassword(payload.password, client.password);
        if (!isMatch) {
            throw new AppError("Invalid password entered.!!", 422);
        }

        const accessToken = await generateToken(payload.email, 'token');
        client.token = accessToken;
        await clientRepository.updateById(client.id, client);

        return {
            authorization: {
                access_token: accessToken,
                token_type: 'bearer',
                expires_in: process.env.TOKEN_EXPIRES_IN
            },
            client: {
                id: client.id,
                name: client.name,
                email: client.email,
                mobile: client.mobile,
            }
        }
    }

    async accountActivate(token) {

        const client = await clientRepository.findByActivationToken(token);
        if (!client) {
            throw new AppError("Account not found.!!", 404);
        }

        const decryptToken = await verifyToken(token);
        if (!decryptToken.valid) {
            throw new AppError(decryptToken.message, 401);
        }

        const activate = await clientRepository.activateClient(client.id);
        if (!activate) {
            throw new AppError("Account activation failed.!!", 422);
        }

        // Send verification email
        await sendMail({
            to: client.email,
            subject: "Welcome to the International Film Festival of India!",
            templateName: "registration.ejs",
            context: {
                client_name: client.name,
                client_email: client.email,
                frontend_base_url: process.env.FRONTEND_URL,
                activate_token: client.activate_token
            }
        });

        return {
            client: {
                id: client.id,
                name: client.name,
                email: client.email,
                mobile: client.mobile,
            }
        }
    }

    async resendActivateToken(email) {

        const client = await authr.findByEmail(email);
        
        console.log(client);
        return;

        if (!client) {
            throw new AppError('Email not registered with us. Please register.!', 404);
        }

        const activationToken = await generateToken(email, 'activate_Token');
        client.activate_token = activationToken;

        await clientRepository.updateById(client.id, client);

        await sendMail({
            to: client.email,
            subject: "Welcome to the International Film Festival of India!",
            templateName: "registration.ejs",
            context: {
                client_name: client.name,
                client_email: client.email,
                frontend_base_url: process.env.FRONTEND_URL,
                activate_token: client.activate_token
            }
        });

    }

    async checkActive(email) {

        const client = await clientRepository.findByEmail(email);

        if (!client) {
            throw new AppError("Invalid email entered.!!", 404);
        }

        if (client.active != 1) {
            throw new AppError("Please activate your account first.!!", 422);
        }

        if (client.isblocked != 0) {
            throw new AppError("You are blocked by Admin. Please connect our support.!!", 422);
        }

        return client;
    };

    async passwordChange(payload) {

        const client = await clientRepository.findByEmail(payload.email);

        if (!client) {
            throw new AppError("Invalid email entered.!!", 404);
        }

        const hashedPassword = payload.password ? await hashPassword(payload.password) : null;
        client.password = hashedPassword;

        return await clientRepository.updateById(client.id, client);

    };
}

export default new ClientService();