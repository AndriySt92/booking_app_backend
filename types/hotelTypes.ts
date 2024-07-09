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

export interface ISearchQuery {
  destination?: string
  adultCount?: string
  childCount?: string
  facilities?: string | string[]
  types?: string | string[]
  stars?: string | string[]
  maxPrice?: string
  sortOption?: 'starRating' | 'pricePerNightAsc' | 'pricePerNightDesc'
  page?: string
}

export interface IConstructedQuery {
  $or?: { city?: RegExp; country?: RegExp }[]
  adultCount?: { $gte: number }
  childCount?: { $gte: number }
  facilities?: { $all: string[] }
  type?: { $in: string[] }
  starRating?: { $in: number | number[] }
  pricePerNight?: { $lte: string }
}

export interface ISortOptions {
  [key: string]: 1 | -1
}

export interface IHotelSearchResponse {
  data: IHotel[]
  pagination: {
    total: number
    page: number
    pages: number
  }
}
