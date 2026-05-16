import validateStepMiddleware from '../middlewares/validateStep.middleware.js';
import coProducerController from '../controllers/ip/coProducer.controller.js';
import coProducerValidator from '../validations/coProducer.validator.js';
import validateRequest from '../middlewares/validateRequest.js';
import ipController from '../controllers/ip/ip.controller.js';
import ipValidator from '../validations/ip.validator.js';
import express from 'express';
import multer from 'multer';

const router = express.Router();
const upload = multer();

// IP-FORM

router
    .post('/add-form', validateRequest(ipValidator.entryFormSchema()), ipController.addForm)
    .put('/update-form/:id', upload.any(), validateStepMiddleware.validateByStep, ipController.updateForm)
    .get('/get-form/:id', ipController.getForm)
    .delete('/delete-form/:id', ipController.deleteForm)

//IP - CO-PRODUCERS

router.post('/add-co-producer',
    upload.any(),
    validateRequest(coProducerValidator.addCoProducerSchema()),
    coProducerController.addCoProducer
);

router.put('/update-co-producer/:id',
    upload.any(),
    validateRequest(coProducerValidator.updateCoProducerSchema()),
    coProducerController.updateCoProducer
);

router
    .get('/get-co-producer/:type/:id', coProducerController.masterData)
    .delete('/delete-co-producer/:id', coProducerController.deleteForm)


export default router;