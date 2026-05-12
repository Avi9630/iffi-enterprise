import clientRepository from '../queries/client.repository.js';
import clientService from './client.service.js';
import AppError from '../utills/AppError.js';

class AuthService {
    async registerClient(data) {

        const { captcha } = data;

        // Verify captcha (uncomment when live)
        // const captchaResult = await verifyCapcha(captcha);
        // if (!captchaResult.success) {
        //     throw new AppError("Captcha verification failed", 422);
        // }

        // Create client
        const client = await clientService.createClient(data);

        // Send verification email
        await this.sendVerificationEmail(client);

        return {
            id: client.id,
            email: client.email,
            name: client.name
        };
    }

    async loginClient(payload) {
        const client = await clientService.checkActive(payload.email);
        const accessToken = await clientService.genrateToken(client, payload);
        return {
            authorization: {
                access_token: accessToken,
                token_type: 'bearer',
                expires_in: process.env.JWT_EXPIRES_IN
            },
            client: {
                id: client.id,
                name: client.name,
                email: client.email,
                mobile: client.mobile,
            }
        }
    }

    async verifyEmailToken(token) {
        const client = await clientRepository.findByActivationToken(token);

        if (!client) {
            throw new AppError("Invalid or expired verification token", 400);
        }

        if (client.is_verified) {
            throw new AppError("Email already verified", 400);
        }

        const verifiedClient = await clientRepository.activateClient(client.id);
        return verifiedClient;
    }

    async resendVerificationEmail(email) {
        const client = await clientRepository.findByEmail(email);

        if (!client) {
            throw new AppError("Client not found", 404);
        }

        if (client.is_verified) {
            throw new AppError("Email already verified", 400);
        }

        await this.sendVerificationEmail(client);
        return { message: "Verification email sent" };
    }

    async accountActivate(token) {

        const client = await clientRepository.findByActivationToken(token);
        if (!client) {
            throw new AppError("Client not found.!!", 404);
        }

        const activate = await clientRepository.activateClient(client.id);

        if (!activate) {
            throw new AppError("Account activation failed.!!", 422);
        }

        await this.sendVerificationEmail(client);

        return {
            client: {
                id: client.id,
                name: client.name,
                email: client.email,
                mobile: client.mobile,
            }
        }
    }
}

export default new AuthService();