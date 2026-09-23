import { Router } from 'express';

const router = Router();

router.get('/live', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

router.get('/', (req, res) => {
    res.status(200).json({
        status: true,
        message: 'IFFi Enterprise API Running.!'
    });
});

export default router;