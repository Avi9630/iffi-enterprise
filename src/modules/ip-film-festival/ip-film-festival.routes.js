import { authMiddleware, validateRequest } from '../../middlewares/index.js'
import ipFilmFestivalController from './ip-film-festival.controller.js'
import ipFilmFestivalValidator from './ip-film-festival.validator.js'

import express from 'express';

const router = express.Router();

router.use(authMiddleware.verifyToken);

router.post('/add',
    validateRequest(ipFilmFestivalValidator.addIpFilmFestivalSchema(), 'body'),
    ipFilmFestivalController.addFilmFestival
);

router.patch('/update/:id',
    validateRequest(ipFilmFestivalValidator.updateIpFilmFestivalSchema()),
    ipFilmFestivalController.updateFilmFestival
);

router
    .get('/get-by/:id', ipFilmFestivalController.getForm)

    .delete('/delete/:id', ipFilmFestivalController.deleteForm)

export default router;