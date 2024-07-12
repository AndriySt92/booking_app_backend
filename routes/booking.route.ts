import express from 'express'
import { authenticate } from '../middlewares'
import { ctrlWrapper } from '../utils'
import { getMyBookings } from '../controllers/booking.controller'

const router = express.Router()

router.get('/', authenticate as any, ctrlWrapper(getMyBookings))

export default router
