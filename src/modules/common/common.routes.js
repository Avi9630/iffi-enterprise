
import express from 'express'
import commonController from './common.controller.js';
import { validateRequest } from '../../middlewares/index.js';
import commonValidator from './common.validator.js';

const router = express.Router();

router.get('/master-data/:type', validateRequest(commonValidator.masterDataSchema, 'params'), commonController.masterData);

export default router;