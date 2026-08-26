
import { validateRequest } from '../../middlewares/index.js';
import commonController from './common.controller.js';
import commonValidator from './common.validator.js';
import express from 'express'

const router = express.Router();

router.get('/master-data/:type', validateRequest(commonValidator.masterDataSchema, 'params'), commonController.masterData);

export default router;