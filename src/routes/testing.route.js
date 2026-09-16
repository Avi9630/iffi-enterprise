import { Router } from 'express';
import { redisClient } from '../configs/redis.js';

const router = Router();

router.get('/live', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

router.get('/', (req, res) => {
    res.json({
        status: true,
        message: 'IFFI Enterprise API Running'
    });
});

export default router;