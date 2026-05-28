import { authMiddleware, validateRequest } from '../../middlewares/index.js';
import authController from './auth.controller.js';
import authValidator from './auth.validator.js';
import express from 'express'

const router = express.Router();

router
    .post('/resend-activation-token', validateRequest(authValidator.verifyEmailSchema), authController.resendActivateToken)
    .post('/change-password', validateRequest(authValidator.changePasswordSchema), authController.changePassword)
    .post('/reset-password', validateRequest(authValidator.sendOtpSchema), authController.resetPassword)
    .post('/verify-email', validateRequest(authValidator.verifyEmailSchema), authController.verifyEmail)
    .post('/verify-otp', validateRequest(authValidator.verifyOtpSchema), authController.verifyOtp)
    
    // Login & Register
    .post('/register', validateRequest(authValidator.registerSchema), authController.register)
    .post('/login', validateRequest(authValidator.loginSchema), authController.login)
    .get('/activate-account/:token', authController.activateAccount)
    .post('/logout', authMiddleware.verifyToken, authController.logout)

// router
//     .route('/activate-account/:token')
//     .get(authController.activateAccount)
//     .post(authController.activateAccount);

export default router;