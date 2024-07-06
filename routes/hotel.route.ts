import express from 'express'
import { ctrlWrapper } from '../utils'
import {
  getHotelById,
  getHotels,
  getHotelByCountry,
  searchHotels,
} from '../controllers/hotel.controller'

const router = express.Router()

router.get('/search', ctrlWrapper(searchHotels))
router.get('/hotels-by-country', ctrlWrapper(getHotelByCountry))
router.get('/:id', ctrlWrapper(getHotelById))
router.get('/', ctrlWrapper(getHotels))

export default router
