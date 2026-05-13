import authenticatedRoutes from './authenticated.route.js'
import authRoutes from './auth.route.js'
import apiRoutes from './api.route.js';
import express from 'express';

const router = express.Router();

router.use('/', authRoutes);
router.use('/freepi', apiRoutes);
router.use('/auth', authenticatedRoutes);


export default router;