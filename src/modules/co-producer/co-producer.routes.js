import { authMiddleware, validateRequest } from '../../middlewares/index.js';
import coProducerController from './co-producer.controller.js';
import coProducerValidator from './co-producer.validator.js';
import express from 'express';
import multer from 'multer';

const router = express.Router();

router.use(authMiddleware.verifyToken);

const upload = multer();

router.post('/add',
    upload.any(),
    validateRequest(coProducerValidator.addCoProducerSchema(), 'body'),
    coProducerController.addCoProducer
);

router.patch('/update/:id',
    upload.any(),
    validateRequest(coProducerValidator.updateCoProducerSchema()),
    coProducerController.updateCoProducer
);

router
    .get('/get-by/:id', coProducerController.getForm)

    .delete('/delete/:id', coProducerController.deleteForm)

export default router;