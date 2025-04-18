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

export const getHotelsCountriesSummery = async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 12

  const hotels = await HotelService.getHotelsCountriesSummery(limit)

  res.json(hotels)
}

export const createPayment = async (req: Request, res: Response) => {
  const { numberOfNights } = req.body
  const hotelId = req.params.id
  const userId = req.user?._id

  const { response } = await HotelService.createPayment(
    userId as string,
    hotelId,
    Number(numberOfNights),
  )

  res.send(response)
}

export const createBooking = async (req: Request, res: Response) => {
  const bookingData = req.body
  const userId = req.user?._id
  const hotelId = req.params.id
 
  const result = await HotelService.createBooking(userId as string, hotelId, bookingData)

  res.json({message: result})
}

export const getBookedDates = async (req: Request, res: Response) => {
  const hotelId = req.params.id

  const bookedDates = await HotelService.getBookedDates(hotelId)
  
  res.json(bookedDates)
}
