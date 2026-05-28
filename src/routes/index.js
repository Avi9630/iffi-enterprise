import authenticatedRoutes from './authenticated.route.js'
import { authRoutes } from '../modules/auth/index.js';
import apiRoutes from './api.route.js';
import express from 'express';

const router = express.Router();

router.use('/auth', authRoutes);

router.use('/freepi', apiRoutes);

router.use('/authenticated', authenticatedRoutes);

export default router;