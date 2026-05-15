import validateStepMiddleware from '../middlewares/validateStep.middleware.js';
import validateRequest from '../middlewares/validateRequest.js';
import ipController from '../controllers/ip/ip.controller.js';
import ipValidator from '../validations/ip.validator.js';
import express from 'express';
import multer from 'multer';

const router = express.Router();
const upload = multer();

router.post('/add-form', validateRequest(ipValidator.entryFormSchema()), ipController.addForm);

router.put('/update-form/:id', upload.any(), validateStepMiddleware.validateByStep, ipController.updateForm);

export default router;