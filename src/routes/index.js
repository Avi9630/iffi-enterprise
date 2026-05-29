import authenticatedRoutes from './authenticated.route.js'
import { authRoutes } from '../modules/auth/index.js';
import commonRoutes from '../modules/common/common.routes.js'
import express from 'express';

const router = express.Router();

router.use('/auth', authRoutes);

router.use('/common-data', commonRoutes);

router.use('/authenticated', authenticatedRoutes);

export default router;