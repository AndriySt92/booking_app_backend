import mongoose from 'mongoose'
import { IHotel } from '../types/hotelTypes'

const hotelSchema = new mongoose.Schema<IHotel>(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    description: { type: String, required: true, min: 200 },
    type: { type: String, required: true },
    adultCount: { type: Number, required: true },
    childCount: { type: Number, required: true },
    facilities: [{ type: String, required: true }],
    pricePerNight: { type: Number, required: true },
    starRating: { type: Number, required: true, min: 1, max: 5 },
    imageUrls: [{ type: String, required: true }],
    lastUpdated: { type: Date },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
  },
  { timestamps: true }
)
const Hotel = mongoose.model<IHotel>('Hotel', hotelSchema)
export default Hotel
