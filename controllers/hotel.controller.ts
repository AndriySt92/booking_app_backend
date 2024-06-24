import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import Hotel from '../models/hotel.model'
import { IHotel } from '../types/hotelTypes'
import { httpError } from '../utils'

export const getHotels = async (req: Request, res: Response) => {
  const { page = 1, limit = 12 } = req.query

  const offset = ((page as number) - 1) * (limit as number)

  const hotels = await Hotel.find()
    .skip(offset)
    .limit(limit as number)
    .sort('-lastUpdated')

  const totalCount = await Hotel.countDocuments()

  res.json({ totalCount, hotels })
}

export const getHotelById = async (req: Request, res: Response) => {
    const hotelId = req.params.id
  
    const hotel = await Hotel.findById({
      _id: hotelId,
    })
  
    if (!hotel) {
      throw httpError({ status: 404, message: 'Hotel not found' })
    }
  
    res.json(hotel)
  }
