import express from 'express'
import { authenticate, loginValidation, createHotelValidation, upload } from '../middlewares'
import { ctrlWrapper } from '../utils'
import { createHotel } from '../controllers/hotel.controller'

const router = express.Router()

router.post('/', authenticate as any, createHotelValidation, upload.array("imageFiles", 6), ctrlWrapper(createHotel))

export default router
