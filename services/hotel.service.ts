import Hotel from '../models/hotel.model'
import { IConstructedQuery, ISortOptions } from '../types/hotelTypes'

export const getAll = async (offset: number, limit: number) => {
  const hotels = await Hotel.find().skip(offset).limit(limit).sort('-lastUpdated')

  const total = await Hotel.countDocuments()

  return { total, hotels }
}

export const getById = async (hotelId: string) => {
  return await Hotel.findById(hotelId)
}

export const search = async (query: IConstructedQuery, sortOptions: ISortOptions, skip: number, pageSize: number) => {
  const hotels = await Hotel.find(query).sort(sortOptions).skip(skip).limit(pageSize);

  const total = await Hotel.countDocuments(query);

  return {hotels, total};
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
