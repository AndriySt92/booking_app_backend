import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import Hotel from '../models/hotel.model'
import { IHotel } from '../types/hotelTypes'
import { httpError } from '../utils'
import { uploadImages } from '../utils/uploadImages'

export const createHotel = async (req: Request, res: Response) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    throw httpError({ status: 400, message: errors.array()[0].msg })
  }

  const userId = req.user?._id
  const imageFiles = req.files as Express.Multer.File[]
  const imageUrls = await uploadImages(imageFiles)

  const newHotel: IHotel = {
    ...req.body,
    userId,
    lastUpdated: new Date(),
    imageUrls,
  }

  const hotel = new Hotel(newHotel)
  await hotel.save()

  return res.json({ message: 'ok' })
}

export const getMyHotels = async (req: Request, res: Response) => {
  const hotels = await Hotel.find({ userId: req.user?._id })
  res.json(hotels)
}

export const getMyHotelById = async (req: Request, res: Response) => {
  const hotelId = req.params.id
  
    const hotel = await Hotel.findById({
      _id: hotelId,
      userId: req.user?._id,
    })
  
    if (!hotel) {
      throw httpError({ status: 404, message: 'Hotel not found' })
    }
  
    res.json(hotel)
}

export const updateMyHotel = async (req: Request, res: Response) => {
  const hotelId = req.params.id
  const userId = req.user?._id
  const updatedHotel: IHotel = req.body

  updatedHotel.lastUpdated = new Date()

  const hotel = await Hotel.findOneAndUpdate(
    {
      _id: hotelId,
      userId,
    },
    updatedHotel,
    { new: true },
  )

  if (!hotel) {
    throw httpError({ status: 404, message: 'Hotel not found' })
  }

  const files = req.files as Express.Multer.File[]
  const updatedImageUrls = await uploadImages(files)

  hotel.imageUrls = [...updatedImageUrls, ...(updatedHotel.imageUrls || [])]

  await hotel.save()
  res.status(201).json(hotel)
}

