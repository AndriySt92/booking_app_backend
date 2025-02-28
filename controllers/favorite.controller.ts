import { Request, Response } from 'express'
import FavoriteService from '../services/favorite.service'
import { IUser } from '../types/userTypes'

export const addFavorite = async (req: Request, res: Response) => {
  const { hotelId } = req.body
  const user = req.user

  const result = await FavoriteService.add(hotelId, user as IUser)

  res.status(201).json(result)
}

export const removeFavorite = async (req: Request, res: Response) => {
  const { hotelId } = req.params
  const user = req.user

  const result = await FavoriteService.remove(hotelId, user as IUser)

  res.json(result)
}

export const getFavorites = async (req: Request, res: Response) => {
  const user = req.user

  const favorites = await FavoriteService.getFavorites(user as IUser)

  res.json(favorites)
}

export const getFavoriteHotelIds = async (req: Request, res: Response) => {
  const user = req.user as IUser
  res.json(user.favorites || [])
}
