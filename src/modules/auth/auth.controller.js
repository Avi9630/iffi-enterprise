import clientRepository from '../../queries/client.repository.js';
import twoAuthService from '../../services/twoAuth.service.js';
import clientService from '../../services/client.service.js';
import { ApiResponse, AppError, maskTarget } from '../../utills/index.js';
import { sendMail } from '../../mail/mailer.js';
import prisma from '../../configs/prisma.js';
import authService from './auth.service.js';

class AuthController {

    async register(req, res, next) {
        try {
            const result = await authService.registerClient(req.body);
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

            const existingEmail = await authService.verifyEmail(email);
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
            const result = await authService.loginClient(req.body);

            return ApiResponse(res, 200, {
                message: "Login successful",
                data: result
            });
        } catch (error) {
            return next(error);
        }
    }

    async activateAccount(req, res, next) {

        try {
            const { token } = req.params;
            const result = await authService.accountActivate(token);
            return ApiResponse(res, 200, {
                message: "Account has been activated successfully",
                data: result
            });
        } catch (error) {
            next(error)
        }
    };

    async resendActivateToken(req, res, next) {
        try {
            const { email } = req.body;
            const result = await authService.resendActivateToken(email);
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
            const { type, target } = req.body;
            const ip = req.ip;

            await authService.resetPassword(type, target, ip);

            return ApiResponse(res, 200, {
                message: "An OTP has been send to your registered email address.!!",
            });
        } catch (error) {
            return next(error);
        }
    }

    async verifyOtp(req, res, next) {
        try {
            const { email, otp } = req.body;

            await authService.otpVerify(email, otp);

            return ApiResponse(res, 200, {
                message: "OTP verified successfully.!!",
            });

        } catch (error) {
            return next(error);
        }
    }

    async changePassword(req, res, next) {
        try {

            await authService.passwordChange(req.body);

            return ApiResponse(res, 200, {
                message: "Password has been changed successfully.!!",
            });

        } catch (error) {
            return next(error);
        }
    }

    async logout(req, res, next) {

        try {

            await authService.logout(req.client);
            return ApiResponse(res, 200, {
                message: "Logout successfully.!!",
            });
        } catch (error) {
            next(error);
        }


    }
}

export default new AuthController();