import commonRoutes from '../modules/common/common.routes.js'
import { authRoutes } from '../modules/auth/index.js';
import { ipRoutes } from '../modules/ip-app/index.js';
import express from 'express';

const router = express.Router();

router.use('/auth', authRoutes);

router.use('/common-data', commonRoutes);

router.use('/ip-app', ipRoutes);

export default router;