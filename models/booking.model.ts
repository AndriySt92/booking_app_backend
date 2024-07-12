import mongoose from "mongoose";
import { IBooking } from "../types/bookingTypes";

const bookingSchema = new mongoose.Schema<IBooking>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  adultCount: { type: Number, required: true },
  childCount: { type: Number, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  userId: { type: String, required: true },
  hotelId: { type: String, required: true },
  totalCost: { type: Number, required: true },
});

const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
export default Booking;