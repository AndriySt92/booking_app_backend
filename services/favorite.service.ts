import Hotel from '../models/hotel.model'
import { IHotel } from '../types/hotelTypes'
import { IUser } from '../types/userTypes'
import { httpError } from '../utils'

export const add = async (hotelId: string, user: IUser) => {
  if (!hotelId) {
    throw httpError({ status: 400, message: 'Hotel ID is required' })
  }

  const exists = await Hotel.exists({ _id: hotelId })
  if (!exists) {
    throw httpError({ status: 404, message: 'Hotel not found' })
  }

  if (user.favorites.includes(hotelId)) {
    throw httpError({ status: 400, message: 'Hotel is already in favorites' })
  }

  user.favorites.push(hotelId)
  await user.save()

  return { message: 'Added successfully' }
}

export const remove = async (hotelId: string, user: IUser) => {
  if (!hotelId) {
    throw httpError({ status: 400, message: 'Hotel ID is required' })
  }

  const exists = await Hotel.exists({ _id: hotelId })
  if (!exists) {
    throw httpError({ status: 404, message: 'Hotel not found' })
  }

  if (!user.favorites.includes(hotelId)) {
    throw httpError({ status: 400, message: 'Hotel not found in favorites' })
  }

  user.favorites = user.favorites.filter((id) => id.toString() !== hotelId)
  await user.save()

  return { message: 'Hotel removed from favorites' }
}

export const getAll = async (userId: string, page: number, limit: number) => {
  const offset = (Number(page) - 1) * Number(limit)

  const hotels = await Hotel.find({ userId }).sort({ updatedAt: -1 }).skip(offset).limit(limit)

  if (!hotels) {
    throw httpError({ status: 404, message: 'Hotels not found' })
  }

  const total = await Hotel.countDocuments()

  return { total, hotels }
}

export const getFavorites = async (user: IUser, page: number, limit: number) => {
  if (!user.favorites || user.favorites.length === 0) {
    return []
  }

  const totalFavorites = user.favorites.length
  const totalPages = Math.ceil(totalFavorites / limit)
  const offset = (page - 1) * limit

  const { favorites } = await user.populate({
    path: 'favorites',
    options: {
      skip: offset,
      limit: limit,
    },
  })

  return {
    data: favorites,
    pagination: {
      total: totalFavorites,
      page,
      pages: totalPages,
    },
  }
}

export default {
  add,
  remove,
  getFavorites,
}
