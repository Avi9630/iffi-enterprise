import authMiddleware from '../middlewares/auth.middleware.js'
import ipRoutes from './ip.route.js'
import express from 'express'

const router = express.Router();

router.use(authMiddleware.verifyToken);

router.use('/ip', ipRoutes);

export default router;