import express from 'express'
import { authenticate, upload } from '../middlewares'
import { ctrlWrapper } from '../utils'
import { createHotel, getMyHotels, updateHotel, getHotelById } from '../controllers/hotel.controller'

const router = express.Router()

router.post('/', authenticate as any, upload.array("imageFiles", 6), ctrlWrapper(createHotel))
router.get('/', authenticate as any, ctrlWrapper(getMyHotels))
router.get('/:id', ctrlWrapper(getHotelById))
router.put('/:id', authenticate as any, ctrlWrapper(updateHotel))

export default router
