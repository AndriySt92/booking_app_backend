import Booking from '../models/booking.model'

export const getAll = async (userId: string) => {
  return await Booking.find({ userId })
}

export default {
  getAll,
}
