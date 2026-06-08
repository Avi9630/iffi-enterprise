import authRepo from './auth.repository.js';
import { config } from '../../configs/config.js';
import { sendMail } from '../../mail/mailer.js';
import {
    AppError,
    comparePassword,
    generateAccessToken,
    generateActivationToken,
    generateRefereshToken,
    hashPassword,
    verifyToken
} from '../../utills/index.js';
import { token } from 'morgan';


class AuthService {


    async registerClient(payload) {

        const { email, mobile, password, captcha } = payload;

        // Verify captcha (uncomment when live)
        // const captchaResult = await verifyCapcha(captcha);
        // if (!captchaResult.success) {
        //     throw new AppError("Captcha verification failed", 422);
        // }

        // Validation check Email || Mobile

        const existingEmail = await authRepo.findByEmail(email);
        if (existingEmail) {
            throw new AppError('Email already registered', 409);
        }

        const existingMobile = await authRepo.findByMobile(mobile);
        if (existingMobile) {
            throw new AppError('Mobile number already registered', 409);
        }

        const client = await this._createClient(payload);

        if (!client) {
            throw new AppError('Unable to register client.!', 404);
        }

        // Send verification email //DON'T DELETE THIS CODE-------------------------------

        // await sendMail({
        //     to: client.email,
        //     subject: "Verify Your Registration for IFFI Goa",
        //     templateName: "registration.ejs",
        //     context: {
        //         client_name: client.first_name + ' ' + client.last_name,
        //         frontend_base_url: config.frontendUrl,
        //         activate_token: client.activation_token
        //     }
        // });

        return {
            id: client.id,
            email: client.email,
            mobile: client.mobile,
        };
    }

    async _createClient(payload) {

        const { password, password_confirmation, captcha, client_type_id, ...rest } = payload;

        const hashedPassword = password ? await hashPassword(password) : null;
        const activationToken = await generateActivationToken(payload.email);

        const existsClientType = await authRepo.clientTypeById(client_type_id);

        if (!existsClientType) {
            throw new AppError('Invalid client type.', 404);
        }

        const clientData = {
            ...rest,
            password_hash: hashedPassword,
            activation_token: activationToken,
            status: 2,
            client_types: {
                connect: { id: existsClientType.id }
            }
        }
        return await authRepo.create(clientData);
    }

    async loginClient(payload) {

        const client = await authRepo.findByEmail(payload.email);

        if (!client) {
            throw new AppError("Invalid email entered.!!", 404);
        }

        if (client.status === 2) {
            throw new AppError("Account not activated.!!", 422);
        }

        if (client.status === 3) {
            throw new AppError("Account blocked by ADMIN. Please contact our support.!", 422);
        }

        const isMatch = await comparePassword(payload.password, client.password_hash);

        if (!isMatch) {
            throw new AppError("Invalid password entered.!!", 422);
        }

        const accessToken = await generateAccessToken(client);
        // const refreshToken = await generateRefereshToken(client);

        await authRepo.updateClientById(client.id, {
            token: accessToken
        });

        return {
            authorization: {
                token_type: 'bearer',
                access_token: accessToken,
                access_token_expiresin: config.jwt.jwtAccessTokenExpiresIn,
                // referesh_token: refreshToken
            },
            client: {
                id: client.id,
                name: client.name,
                email: client.email,
                mobile: client.mobile,
            }
        }
    }

    async verifyEmail(email) {

        const existingEmail = await authRepo.findByEmail(email);
        if (!existingEmail) {
            throw new AppError('Email is not registered with us. Please register.!', 404);
        }
        return existingEmail;
    }

    async accountActivate(token) {

        const client = await authRepo.findClientByActivationToken(token);

        if (!client) {
            throw new AppError("Account not found.!", 404);
        }

        if (client.status == 3) {
            throw new AppError("Account blocked by ADMIN. Please contact our support!!", 422);
        }

        const decryptToken = await verifyToken(token);
        if (!decryptToken.valid) {
            throw new AppError(decryptToken.message, 401);
        }

        const activate = await authRepo.accountActivateByClientId(client.id);
        if (!activate) {
            throw new AppError("Account activation failed.!!", 422);
        }

        // Send verification email
        // await sendMail({
        //     to: client.email,
        //     subject: "Welcome to the International Film Festival of India!",
        //     templateName: "registration.ejs",
        //     context: {
        //         client_name: client.name,
        //         client_email: client.email,
        //         frontend_base_url: process.env.FRONTEND_URL,
        //         activate_token: client.activate_token
        //     }
        // });

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

        const client = await authRepo.findByEmail(email);

        if (!client) {
            throw new AppError('Email not registered with us. Please register.!', 404);
        }

        if (client.status == 3) {
            throw new AppError("Account blocked by ADMIN. Please contact our support!!", 422);
        }

        const activationToken = await generateActivationToken(email);

        client.activation_token = activationToken;

        await authRepo.updateClientById(client.id, client);

        // await sendMail({
        //     to: client.email,
        //     subject: "Welcome to the International Film Festival of India!",
        //     templateName: "registration.ejs",
        //     context: {
        //         client_name: client.first_name + ' ' + client.last_name,
        //         client_email: client.email,
        //         frontend_base_url: config.frontendUrl,
        //         activate_token: client.activation_token
        //     }
        // });

    }

    async resetPassword(email, ip) {

        const client = await this._findExistingClient(email);

        const existingOtp = await authRepo.getOtpCodesByClient(client.id);

        let otpCodes;
        if (existingOtp) {
            otpCodes = await this.resendOtp(existingOtp);
        } else {
            otpCodes = await this.sendOtp(email, client, ip);
        }

        // await sendMail({
        //     to: client.email,
        //     subject: "OTP Send",
        //     templateName: "registration.ejs",
        //     context: {
        //         client_name: client.first_name + ' ' + client.last_name,
        //         frontend_base_url: process.env.FRONTEND_URL,
        //         activate_token: client.activate_token,
        //         otp: otpCodes.otp
        //     }
        // });

        return otpCodes;
    }

    async sendOtp(email, client, ip) {

        const EXPIRES_AT = new Date(Date.now() + 10 * 60 * 1000);
        const OTP = Math.floor(100000 + Math.random() * 900000);

        const dataToAdd = {
            client_id: client.id,
            target: email,
            otp: OTP,
            ip_address: ip,
            expires_at: EXPIRES_AT
        };
        const record = await authRepo.addOtpcode(dataToAdd);
        return { record, otp: OTP };
    }

    async resendOtp(existingOtp) {

        const COOLDOWN_MS = 60 * 1000;
        const EXPIRES_AT = new Date(Date.now() + 10 * 60 * 1000);
        const age = Date.now() - new Date(existingOtp.created_at).getTime();

        if (age < COOLDOWN_MS) {
            const waitSec = Math.ceil((COOLDOWN_MS - age) / 1000);
            throw new AppError(
                `Please wait ${waitSec} seconds before requesting a new OTP.`,
                429
            );
        }

        const OTP = Math.floor(100000 + Math.random() * 900000);
        const record = await authRepo.updateOtpById(existingOtp.id,
            {
                otp: OTP,
                status: 2,
                attempts: 0,
                expires_at: EXPIRES_AT,
                verified_at: null
            });
        return { record, plainOtp: OTP };
    }

    async otpVerify(email, otp) {

        const client = await authRepo.findByEmail(email);

        if (!client) {
            throw new AppError('You are not registered with us.', 404);
        }

        const otpCode = await authRepo.getOtpCodesByClient(client.id);

        if (!otpCode) {
            throw new AppError('OTP not found. Please request a new one.', 404);
        }

        if (new Date() > new Date(otpCode.expires_at)) {
            throw new AppError('OTP has expired. Please request a new one.', 422);
        }

        if (otpCode.status == 1) {
            throw new AppError('OTP already verified, Please resend OTP again.!', 422);
        }

        if (otpCode.attempts === 3) {
            throw new AppError('No attempts left. Please request a new OTP.', 422);
        }

        const MAX_ATTEMPTS = 3;

        if (otpCode.otp != otp) {

            if (otpCode.attempts < MAX_ATTEMPTS) {

                otpCode.attempts += 1;
                await authRepo.updateOtpById(otpCode.id, otpCode);
                const attemptsLeft = MAX_ATTEMPTS - otpCode.attempts;

                if (attemptsLeft === 0) {
                    throw new AppError('No attempts left. Please request a new OTP.', 422);
                }

                throw new AppError(
                    `Invalid OTP. You have ${attemptsLeft} attempt${attemptsLeft > 1 ? 's' : ''} left.`,
                    422
                );
            } else {
                throw new AppError('Maximum attempts exceeded. Please request a new OTP.', 422);
            }
        }

        await authRepo.updateOtpById(otpCode.id, {
            status: 1,
            verified_at: new Date()
        });
        return otpCode;
    }

    async passwordChange(payload) {

        const client = await authRepo.findByEmail(payload.email);

        if (!client) {
            throw new AppError("Invalid email entered.!!", 404);
        }

        const hashedPassword = payload.password ? await hashPassword(payload.password) : null;

        return await authRepo.updateClientById(client.id, { password_hash: hashedPassword });

    };

    async logout(client) {
        await authRepo.updateClientById(client.id, { token: null });
        return true
    }

    async _findExistingClient(email) {

        const client = await authRepo.findByEmail(email);

        if (!client) {
            throw new AppError('Account not found.! Please register an account.!', 404);
        }

        if (client.status === 2) {
            throw new AppError("Account not activated.!", 422);
        }

        if (client.status === 3) {
            throw new AppError('Account blocked by ADMIN. Please contact our support.!', 422);
        }

        return client;
    }

}

export default new AuthService();