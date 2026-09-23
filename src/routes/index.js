import express from 'express'
const router = express.Router()

// Auth route
import { authRoutes } from '../modules/auth/index.js'
router.use('/auth', authRoutes)

// import commonRoutes from '../modules/common/common.routes.js'
import { commonRoutes } from '../modules/common/index.js'
router.use('/common-data', commonRoutes)

// import { clientRoutes } from '../modules/client/index.js'
// router.use('/client', clientRoutes)

import { ipRoutes } from '../modules/ip-app/index.js'
router.use('/ip', ipRoutes)

import { coProducerRoutes } from '../modules/co-producer/index.js'
router.use('/ip/co-producer', coProducerRoutes)

import {ipFilmFestivalRoutes} from '../modules/ip-film-festival/index.js'
router.use('/ip/film-festival', ipFilmFestivalRoutes);

export default router