import Hotel from '../models/hotel.model'
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

export const getFavorites = async (user: IUser) => {
  if (!user.favorites || user.favorites.length === 0) {
    return []
  }

  await user.populate('favorites')

  return user.favorites
}

export default {
  add,
  remove,
  getFavorites,
}
