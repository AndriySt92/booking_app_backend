import Booking from '../models/booking.model'
import { IBooking } from '../types/bookingTypes'
import { IPaginatedResponse } from '../types/commonTypes'
import { httpError } from '../utils'

export const getAll = async (userId: string, page: number, limit: number) => {
  const offset = (page - 1) * limit

  const bookings = await Booking.find({ userId }).sort({ createdAt: -1 }).skip(offset).limit(limit)

  if (!bookings) {
    throw httpError({ status: 404, message: 'Bookings not found' })
  }

  const total = await Booking.countDocuments()

  const response: IPaginatedResponse<IBooking> = {
    data: bookings,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
  }

  return response
}

export default {
  getAll,
}
