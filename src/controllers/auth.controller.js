import clientRepository from '../queries/client.repository.js';
import twoAuthService from '../services/twoAuth.service.js';
import clientService from '../services/client.service.js';
import ApiResponse from '../utills/ApiResponse.js';
import AppError from '../utills/AppError.js';
import { sendMail } from '../mail/mailer.js';
import prisma from '../configs/prisma.js';

class AuthController {

    async register(req, res, next) {
        try {
            const result = await clientService.registerClient(req.body);

            return ApiResponse(res, 201, {
                message: "Registration successful. Please check your email to verify your account.",
                data: result
            });
        } catch (error) {
            return next(error);
        }
    }

    async verifyEmail(req, res, next) {
        try {
            const { email } = req.body;

            const existingEmail = await clientRepository.findByEmail(email);

            if (!existingEmail) {
                throw new AppError('Email not registered with us. Please register.!', 404);
            }
            return ApiResponse(res, 200, {
                message: "Email verified successfully. You can now login.",
            });
        } catch (error) {
            return next(error);
        }
    }

    async login(req, res, next) {
        try {
            const result = await clientService.loginClient(req.body);

            return ApiResponse(res, 200, {
                message: "Login successful",
                data: result
            });
        } catch (error) {
            return next(error);
        }
    }

    async activateAccount(req, res, next) {

        const { token } = req.params;
        const result = await clientService.accountActivate(token);
        return ApiResponse(res, 200, {
            message: "Account has been activated successfully",
            data: result
        });
    };

    async resendActivateToken(req, res, next) {
        try {
            const { email } = req.body;
            const result = await clientService.resendActivateToken(email);

            return ApiResponse(res, 201, {
                message: "Please check your email to verify your account.",
                data: result
            });
        } catch (error) {
            return next(error);
        }
    }

    async resetPassword(req, res, next) {
        try {
            const { email } = req.body;

            const client = await clientRepository.findByEmail(email);

            if (!client) {
                throw new AppError('Email not registered with us. Please register.!', 404);
            }

            const result = await twoAuthService.checkTwoAuth(req, client);

            await sendMail({
                to: client.email,
                subject: "OTP Send",
                templateName: "registration.ejs",
                context: {
                    client_name: client.name,
                    frontend_base_url: process.env.FRONTEND_URL,
                    activate_token: client.activate_token
                }
            });

            return ApiResponse(res, 200, {
                message: "An OTP has been send to your registered email address.!!",
                data: {
                    otp: result.authcode
                }
            });
        } catch (error) {
            return next(error);
        }
    }

    async verifyOtp(req, res, next) {
        try {

            const { email, otp } = req.body;

            const client = await clientRepository.findByEmail(email);

            if (!client) {
                throw new AppError('Email not registered with us. Please register.!', 404);
            }

            await twoAuthService.otpVerify(client, req.body);

            return ApiResponse(res, 200, {
                message: "OTP verified successfully.!!",
            });

        } catch (error) {
            return next(error);
        }
    }

    async changePassword(req, res, next) {
        try {

            await clientService.passwordChange(req.body);

            return ApiResponse(res, 200, {
                message: "Password changed successfully.!!",
            });

        } catch (error) {
            return next(error);
        }
    }

    async logout(req, res, next) {
        await prisma.clients.update({
            where: {
                id: req.client.id
            },
            data: {
                token: null
            }
        });

        return res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    }

}

export default new AuthController();