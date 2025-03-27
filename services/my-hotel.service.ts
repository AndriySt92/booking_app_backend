import Booking from '../models/booking.model'
import Hotel from '../models/hotel.model'
import User from '../models/user.model'
import { IHotel } from '../types/hotelTypes'
import { httpError } from '../utils'
import { uploadImages } from '../utils/uploadImages'

export const create = async (
  newHotelData: IHotel,
  userId: string,
  imageFiles: Express.Multer.File[],
) => {
  const imageUrls = await uploadImages(imageFiles)

  const newHotel: IHotel = {
    ...newHotelData,
    userId,
    lastUpdated: new Date(),
    imageUrls,
  }

  const hotel = await Hotel.create({
    ...newHotel,
  })

  return hotel
}

export const getAll = async (userId: string) => {
  return await Hotel.find({ userId }).sort({ updatedAt: -1 })
}

export const getById = async (hotelId: string, userId: string) => {
  const hotel = await Hotel.findOne({
    _id: hotelId,
    userId,
  })

  if (!hotel) {
    throw httpError({ status: 404, message: 'Hotel not found' })
  }

  return hotel
}

export const update = async (
  updatedHotelData: IHotel,
  hotelId: string,
  userId: string,
  files: Express.Multer.File[],
) => {
  updatedHotelData.lastUpdated = new Date()

  const hotel = await Hotel.findOneAndUpdate(
    {
      _id: hotelId,
      userId,
    },
    updatedHotelData,
    { new: true },
  )

  if (!hotel) {
    throw httpError({ status: 404, message: 'Hotel not found or user not authorized to update' })
  }

  const updatedImageUrls = await uploadImages(files)
  hotel.imageUrls = [...updatedImageUrls, ...(updatedHotelData.imageUrls || [])]
  await hotel.save()

  return hotel
}

export const remove = async (hotelId: string, userId: string) => {
  const deletedHotel = await Hotel.findByIdAndDelete({
    _id: hotelId,
    userId,
  })

  if (!deletedHotel) {
    throw new Error('Hotel not found or user not authorized to delete')
  }

  // Delete all bookings related to this hotel
  await Booking.deleteMany({ hotelId: deletedHotel._id })

  // Remove hotel from all users' favorites
  await User.updateMany({ favorites: deletedHotel._id }, { $pull: { favorites: deletedHotel._id } })

  return { message: 'Hotel deleted successfully' }
}

export default {
  create,
  update,
  getAll,
  getById,
  remove,
}
