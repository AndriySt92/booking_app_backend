import express from 'express'
import { ctrlWrapper } from '../utils'
import { getHotelById, getHotels } from '../controllers/hotel.controller'

const router = express.Router()

router.get('/', ctrlWrapper(getHotels))
router.get('/:id', ctrlWrapper(getHotelById))

export default router
