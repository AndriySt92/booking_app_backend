import { constructSearchQuery } from '../helpers/constructSearchQuery'
import Hotel from '../models/hotel.model'
import { IConstructedQuery, IHotelSearchResponse, ISearchQuery, ISortOptions } from '../types/hotelTypes'
import { httpError } from '../utils'

export const getAll = async (page: number, limit: number) => {
  const offset = (Number(page) - 1) * Number(limit)

  const hotels = await Hotel.find().skip(offset).limit(limit).sort('-lastUpdated')

  if (!hotels) {
    throw httpError({ status: 404, message: 'Hotels not found' })
  }
  const total = await Hotel.countDocuments()

  return { total, hotels }
}

export const getById = async (hotelId: string) => {
  const hotel = await Hotel.findById(hotelId)

  if (!hotel) {
    throw httpError({ status: 404, message: 'Hotel not found' })
  }

  return hotel
}

export const search = async (searchQuery: ISearchQuery) => {
  const consructedQuery: IConstructedQuery = constructSearchQuery(searchQuery)

  let sortOptions: ISortOptions = {} as ISortOptions
  switch (searchQuery.sortOption) {
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
  const pageNumber = parseInt(searchQuery.page ? searchQuery.page.toString() : '1')
  const skip = (pageNumber - 1) * pageSize
  const hotels = await Hotel.find(consructedQuery).sort(sortOptions).skip(skip).limit(pageSize);

  const total = await Hotel.countDocuments(consructedQuery);

  const response: IHotelSearchResponse = {
    data: hotels,
    pagination: {
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
    },
  }

  return {response};
};

export const getRandomHotelSummaryByCountry = async (limit: number): Promise<any[]> => {
  return Hotel.aggregate([
    {
      $group: {
        _id: '$country',
        hotels: { $push: { _id: '$_id', imageUrls: { $arrayElemAt: ['$imageUrls', 0] } } },
        total: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        country: '$_id',
        total: 1,
        randomHotel: {
          $arrayElemAt: [
            '$hotels',
            { $floor: { $multiply: [{ $rand: {} }, { $size: '$hotels' }] } },
          ],
        },
      },
    },
    { $limit: limit },
  ])
}

export default {
  getAll,
  getById,
  search,
  getRandomHotelSummaryByCountry,
}
