import validateRequest from '../../middleware/validateRequest.js'
import authController from './auth.controller.js'
import authValidator from './auth.validator.js'
import express from 'express'

const router = express.Router();

router.post('/register',
    validateRequest(authValidator.registerSchema),
    authController.register
);

// POST /api/v1/auth/login
// router.post(
//     '/login',
//     // validateRequest(loginSchema),
//     // authController.login
// );

// POST /api/v1/auth/logout
// router.post('/logout', authController.logout);

export default router;