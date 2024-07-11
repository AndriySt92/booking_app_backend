import Stripe from 'stripe'
import { constructSearchQuery } from '../helpers/constructSearchQuery'
import Hotel from '../models/hotel.model'
import Booking from '../models/booking.model'
import {
  IConstructedQuery,
  IHotelSearchResponse,
  ISearchQuery,
  ISortOptions,
} from '../types/hotelTypes'
import { IBooking } from '../types/bookingTypes'
import { httpError } from '../utils'

const stripe = new Stripe(process.env.STRIPE_API_KEY as string)

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
  const hotels = await Hotel.find(consructedQuery).sort(sortOptions).skip(skip).limit(pageSize)

  const total = await Hotel.countDocuments(consructedQuery)

  const response: IHotelSearchResponse = {
    data: hotels,
    pagination: {
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
    },
  }

  return { response }
}

export const getRandomHotelSummaryByCountry = async (limit: number) => {
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

export const createPayment = async (userId: string, hotelId: string, numberOfNights: number) => {
  const hotel = await Hotel.findById(hotelId)

  if (!hotel) {
    throw httpError({ status: 404, message: 'Hotel not found' })
  }

  const totalCost = hotel.pricePerNight * numberOfNights

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalCost * 100,
    currency: 'eur',
    metadata: {
      hotelId,
      userId: userId.toString(),
    },
  })

  if (!paymentIntent.client_secret) {
    throw httpError({ status: 500, message: 'Error creating payment intent' })
  }

  const response = {
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret.toString(),
    totalCost,
  }

  return { response }
}

export const createBooking = async (
  userId: string,
  hotelId: string,
  bookingData: IBooking & { paymentIntentId: string },
) => {
  const { paymentIntentId, ...bookingInfo } = bookingData

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId as string)

  if (!paymentIntent) {
    throw httpError({ status: 404, message: 'Payment intent not found' })
  }

  if (
    paymentIntent.metadata.hotelId !== hotelId ||
    paymentIntent.metadata.userId !== userId.toString()
  ) {
    throw httpError({ status: 404, message: 'Payment intent mismatch' })
  }

  const newBooking: IBooking = {
    ...bookingInfo,
    userId,
    hotelId,
  }

  const booking = await Booking.create(newBooking)

  const hotel = await Hotel.findOneAndUpdate(
    { _id: hotelId },
    {
      $push: { bookings: booking._id },
    },
  )

  if (!hotel) {
    throw httpError({ status: 404, message: 'Hotel not found' })
  }

  await hotel.save()

  return 'Create booking successfully!'
}

export const getBookedDates = async (hotelId: string) => {
  const bookings = await Booking.find({ hotelId }).select('checkIn checkOut')
  return bookings
}

export default {
  getAll,
  getById,
  search,
  getRandomHotelSummaryByCountry,
  createPayment,
  createBooking,
  getBookedDates,
}
