import { Request, Response } from 'express'
import BookingService from '../services/booking.service'

export const getMyBookings = async (req: Request, res: Response) => {
  const userId = req.user?._id
  const { page = 1, limit = 5 } = req.query

  const bookings = await BookingService.getAll(userId as string, Number(page), Number(limit))

  res.json(bookings)
}
