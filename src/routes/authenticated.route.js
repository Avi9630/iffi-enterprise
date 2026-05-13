import authController from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js'
import ipRoutes from './ip.route.js'
import express from 'express'

const router = express.Router();

router.use(authMiddleware.verifyToken);

router.use('/ip', ipRoutes);
router.post('/logout',authController.logout);

// ... other protected routes

export default router;