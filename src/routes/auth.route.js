import authController from '../modules/auth/auth.controller.js'
import { validateRequest } from '../middlewares/index.js'
import authValidator from '../modules/auth/auth.validator.js'
import express from 'express'

const router = express.Router();

router
    .post('/register', validateRequest(authValidator.registerSchema), authController.register)
    .post('/login', validateRequest(authValidator.loginSchema), authController.login)
    .post('/verify-email', validateRequest(authValidator.verifyEmailSchema), authController.verifyEmail)
    .get('/activate-account/:token', validateRequest(authValidator.loginSchema), authController.activateAccount)
    .post('/activate-account/:token', validateRequest(authValidator.loginSchema), authController.activateAccount)
    .post('/resend-activation', validateRequest(authValidator.verifyEmailSchema), authController.resendActivateToken)
    .post('/reset-password', validateRequest(authValidator.resetPasswordSchema), authController.resetPassword)
    .post('/verify-otp', validateRequest(authValidator.verifyOtpSchema), authController.verifyOtp)
    .post('/change-password', validateRequest(authValidator.changePasswordSchema), authController.changePassword)

export default router;