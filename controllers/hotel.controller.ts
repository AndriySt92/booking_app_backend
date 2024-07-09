import { Request, Response } from 'express'
import HotelService from '../services/hotel.service'

export const getHotels = async (req: Request, res: Response) => {
  const { page = 1, limit = 12 } = req.query

  const { total, hotels } = await HotelService.getAll(Number(page), Number(limit))

  res.json({ total, hotels })
}

export const getHotelById = async (req: Request, res: Response) => {
  const hotelId = req.params.id

  const hotel = await HotelService.getById(hotelId)

  res.json(hotel)
}

export const searchHotels = async (req: Request, res: Response) => {
  const searchQuery = req.query

  const { response } = await HotelService.search(searchQuery)

  res.json(response)
}

export const getHotelByCountry = async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 12

  const hotels = await HotelService.getRandomHotelSummaryByCountry(limit)

  res.json(hotels)
}
