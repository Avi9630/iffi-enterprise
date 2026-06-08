import express from 'express'
const router = express.Router()


import commonRoutes from '../modules/common/common.routes.js'
router.use('/common-data', commonRoutes)

import { authRoutes } from '../modules/auth/index.js'
router.use('/auth', authRoutes)

// import { clientRoutes } from '../modules/client/index.js'
// router.use('/client', clientRoutes)

import { ipRoutes } from '../modules/ip-app/index.js'
router.use('/ip-app', ipRoutes)

import { coProducerRoutes } from '../modules/co-producer/index.js'
router.use('/ip/co-producer', coProducerRoutes)

import {ipFilmFestivalRoutes} from '../modules/ip-film-festival/index.js'
router.use('/ip/film-festival', ipFilmFestivalRoutes);

export default router