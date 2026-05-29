import express from 'express';
import commonController from '../modules/common/common.controller.js';

const router = express.Router();

router.get('/master-data/:type',commonController.masterData);

export default router;