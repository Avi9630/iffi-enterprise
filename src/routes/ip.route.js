import express from 'express';
import ipController from '../controllers/ip/ip.controller.js';
import validateRequest from '../middlewares/validateRequest.js';
import ipValidator from '../validations/ip.validator.js';

const router = express.Router();

router
    .post('/add-form', validateRequest(ipValidator.entryFormSchema), ipController.addForm)
export default router;