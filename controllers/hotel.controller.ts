import { Request, Response } from 'express'
import { IHotelSearchResponse, ISortOptions } from '../types/hotelTypes'
import { httpError } from '../utils'
import hotelService from '../services/hotel.service'
import { constructSearchQuery } from '../helpers/constructSearchQuery'
import HotelService from '../services/hotel.service'

export const getHotels = async (req: Request, res: Response) => {
  const { page = 1, limit = 12 } = req.query
  const offset = (Number(page) - 1) * Number(limit)

  const { total, hotels } = await hotelService.getAll(offset, Number(limit))

  if (!hotels) {
    throw httpError({ status: 404, message: 'Hotels not found' })
  }

  res.json({ total, hotels })
}

export const getHotelById = async (req: Request, res: Response) => {
  const hotelId = req.params.id

  const hotel = await hotelService.getById(hotelId)

  if (!hotel) {
    throw httpError({ status: 404, message: 'Hotel not found' })
  }

  res.json(hotel)
}

export const searchHotels = async (req: Request, res: Response) => {
  const query = constructSearchQuery(req.query)

  let sortOptions: ISortOptions = {} as ISortOptions
  switch (req.query.sortOption) {
    case 'starRating':
      sortOptions = { starRating: -1 }
      break
    case 'pricePerNightAsc':
      sortOptions = { pricePerNight: 1 }
      break
    case 'pricePerNightDesc':
      sortOptions = { pricePerNight: -1 }
      break
  }

  const pageSize = 5
  const pageNumber = parseInt(req.query.page ? req.query.page.toString() : '1')
  const skip = (pageNumber - 1) * pageSize

  const { hotels, total } = await HotelService.search(query, sortOptions, skip, pageSize)

  const response: IHotelSearchResponse = {
    data: hotels,
    pagination: {
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
    },
  }

  res.json(response)
}

export const getHotelByCountry = async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 12

  const hotels = await hotelService.getRandomHotelSummaryByCountry(limit)

  res.json(hotels)
}
