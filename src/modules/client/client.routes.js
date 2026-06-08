import { authMiddleware, validateRequest, } from '../../middlewares/index.js';

import express from 'express';

import multer from 'multer';

const router = express.Router();

router.use(authMiddleware.verifyToken);

const upload = multer();

router
    .post('/add-form', validateRequest(ipValidator.entryFormSchema()), ipController.addForm)

    .patch('/update-form/:id', upload.any(), validateStep.validateByStep, ipController.updateForm)

    .get('/get-form/:id', ipController.getForm)

    .delete('/delete-form/:id', ipController.deleteForm)

export default router;