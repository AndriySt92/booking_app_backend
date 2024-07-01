export interface IHotel {
  _id: string
  userId: string
  name: string
  city: string
  country: string
  description: string
  type: string
  adultCount: number
  childCount: number
  facilities: string[]
  pricePerNight: number
  starRating: number
  imageUrls: string[]
  lastUpdated: Date
  bookings: IBooking[]
}

export interface IBooking {
  _id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  adultCount: number
  childCount: number
  checkIn: Date
  checkOut: Date
  totalCost: number
}

export interface IHotelSearchResponse {
  data: IHotel[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};
