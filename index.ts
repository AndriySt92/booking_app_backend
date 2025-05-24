import express, { NextFunction, Response, Request } from 'express'
import 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectToMongoDB from './db/connectDb'
import authRoutes from './routes/auth.route'
import myHotelRoutes from './routes/my-hotel.route'
import hotelRoutes from './routes/hotel.route'
import bookingRoutes from './routes/booking.route'
import favoriteRoutes from './routes/favorite.route'
import { IHttpError } from './types/errorTypes'
import { errorMessageList, httpError } from './utils/httpError'
import { errorHandler } from './middlewares'

const app = express()

const PORT = process.env.PORT || 3001

app.use(
  cors({
    origin: function (origin, callback) {
      callback(null, true)
    },
    credentials: true,
  }),
)
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/my-hotels', myHotelRoutes)
app.use('/api/hotels', hotelRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/favorites', favoriteRoutes)

app.all('*', (req, _res, _next): void => {
  throw httpError({ status: 404, message: `Route ${req.originalUrl} not found` })
})

app.use(errorHandler)

app.listen(PORT, () => {
  connectToMongoDB()
  console.log(`server is listening on ${PORT}`)
})
