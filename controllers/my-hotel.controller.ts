import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { IHotel } from '../types/hotelTypes'
import { httpError } from '../utils'
import MyHotelService from '../services/my-hotel.service'

export const createMyHotel = async (req: Request, res: Response) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    throw httpError({ status: 400, message: errors.array()[0].msg })
  }

  const userId = req.user?._id
  const imageFiles = req.files as Express.Multer.File[]
  const newHotelData = req.body

  await MyHotelService.create(newHotelData, userId as string, imageFiles)

  res.status(201).json({ message: 'Hotel created successfully' })
}

export const getMyHotels = async (req: Request, res: Response) => {
  const userId = req.user?._id

  const hotels = await MyHotelService.getAll(userId as string)

  res.json(hotels)
}

export const getMyHotelById = async (req: Request, res: Response) => {
  const hotelId = req.params.id
  const userId = req.user?._id

  const hotel = await MyHotelService.getById(hotelId, userId as string)

  res.json(hotel)
}

export const updateMyHotel = async (req: Request, res: Response) => {
  const hotelId = req.params.id
  const userId = req.user?._id
  const updatedHotelData: IHotel = req.body
  const files = req.files as Express.Multer.File[]

  const hotel = await MyHotelService.update(updatedHotelData, hotelId, userId as string, files)

  res.json(hotel)
}

export const deleteMyHotel = async (req: Request, res: Response) => {
  const hotelId = req.params.id
  const userId = req.user?._id

  const result = await MyHotelService.remove(hotelId, userId as string)

  res.json({
    message: result.message,
  })
}
