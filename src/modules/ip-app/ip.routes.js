import { authMiddleware, validateRequest, validateStep } from '../../middlewares/index.js';
import ipValidator from './ip.validator.js';
import ipController from './ip.controller.js';
import express from 'express';
import multer from 'multer';

const router = express.Router();

router.use(authMiddleware.verifyToken);

const upload = multer();

// IP-FORM

router
    .post('/add-form', validateRequest(ipValidator.entryFormSchema()), ipController.addForm)

    .put('/update-form/:id', upload.any(), validateStep.validateByStep, ipController.updateForm)
    
    .get('/get-form/:id', ipController.getForm)
    
    .delete('/delete-form/:id', ipController.deleteForm)

//IP - CO-PRODUCERS

// router.post('/add-co-producer',
//     upload.any(),
//     validateRequest(coProducerValidator.addCoProducerSchema()),
//     coProducerController.addCoProducer
// );

// router.put('/update-co-producer/:id',
//     upload.any(),
//     validateRequest(coProducerValidator.updateCoProducerSchema()),
//     coProducerController.updateCoProducer
// );

// router
//     .get('/get-co-producer/:type/:id', coProducerController.masterData)
//     .delete('/delete-co-producer/:id', coProducerController.deleteForm)


export default router;