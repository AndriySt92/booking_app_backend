import express from 'express'
import { ctrlWrapper } from '../utils'
import { getHotelById, getHotels, searchHotels } from '../controllers/hotel.controller'

const router = express.Router()

router.get('/search', ctrlWrapper(searchHotels))
router.get('/:id', ctrlWrapper(getHotelById))
router.get('/', ctrlWrapper(getHotels))

export default router
