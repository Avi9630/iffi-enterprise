import express from 'express';
import commonController from '../controllers/common.controller.js';

const router = express.Router();

router.get('/master-data/:type',commonController.masterData);

export default router;