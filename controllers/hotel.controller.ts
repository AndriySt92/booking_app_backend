import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import cloudinary from 'cloudinary'
import Hotel from '../models/hotel.model'
import { IHotel } from '../types/hotelTypes'
import { httpError } from '../utils'

export const createHotel = async (req: Request, res: Response) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    throw httpError({ status: 400, message: errors.array()[0].msg })
  }

  const imageFiles = req.files as Express.Multer.File[]
  const imageUrls = await uploadImages(imageFiles)
  //@ts-ignore
  const newHotel: IHotel = { ...req.body, userId: req.user?._id, lastUpdated: new Date(), imageUrls }

  const hotel = new Hotel(newHotel)
  await hotel.save()

  return res.json({ message: 'ok' })
}

async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString('base64')
    let dataURI = 'data:' + image.mimetype + ';base64,' + b64
    const res = await cloudinary.v2.uploader.upload(dataURI)
    return res.url
  })

  const imageUrls = await Promise.all(uploadPromises)
  return imageUrls
}
