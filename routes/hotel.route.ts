import express from 'express'
import { ctrlWrapper } from '../utils'
import {
  getHotelById,
  getHotels,
  getHotelsCountriesSummery,
  searchHotels,
  createPayment,
  createBooking,
  getBookedDates
} from '../controllers/hotel.controller'
import { authenticate } from '../middlewares'

const router = express.Router()

router.get('/search', ctrlWrapper(searchHotels))
router.get('/countries-summary', ctrlWrapper(getHotelsCountriesSummery))
router.post('/:id/bookings/payment-intent', authenticate as any, ctrlWrapper(createPayment))
router.post('/:id/bookings', authenticate as any, ctrlWrapper(createBooking))
router.get('/:id/booked-dates', authenticate as any, ctrlWrapper(getBookedDates))
router.get('/:id', ctrlWrapper(getHotelById))
router.get('/', ctrlWrapper(getHotels))

export default router
