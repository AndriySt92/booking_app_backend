import { Request, Response } from 'express'
import BookingService from '../services/booking.service'

export const getMyBookings = async (req: Request, res: Response) => {
  const userId = req.user?._id

  const bookings = await BookingService.getAll(userId as string)

  res.json(bookings)
}


