import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import Hotel from '../models/hotel.model'
import { IHotel, IHotelSearchResponse } from '../types/hotelTypes'
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

export const searchHotels = async (req: Request, res: Response) => {
  const query = constructSearchQuery(req.query)

  let sortOptions = {}
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

  const hotels = await Hotel.find(query).sort(sortOptions).skip(skip).limit(pageSize)

  if (!hotels) {
    throw httpError({ status: 404, message: 'Hotel not found' })
  }
  
  const total = await Hotel.countDocuments(query)

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

const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {}

  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, 'i') }, // The "i" flag stands for "ignore case", it will match "new york", "New York", "NEW YORK"
      { country: new RegExp(queryParams.destination, 'i') },
    ]
  }

  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    }
  }

  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    }
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    }
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types) ? queryParams.types : [queryParams.types],
    }
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars)

    constructedQuery.starRating = { $in: starRatings }
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    }
  }

  return constructedQuery
}
