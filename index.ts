import express, { NextFunction, Response, Request } from 'express'
import 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectToMongoDB from './db/connectDb'
import authRoutes from './routes/auth.route'
import myHotelRoutes from './routes/my-hotel.route'
import hotelRoutes from './routes/hotel.route'
import bookingRoutes from './routes/booking.route'
import { IHttpError } from './types/errorTypes'
import { errorMessageList } from './utils/httpError'

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

app.use((req: Request, res: Response): void => {
  res.status(404).json({ message: 'Not Found' })
})

app.use((err: IHttpError, req: Request, res: Response, next: NextFunction): void => {
  //To avoid an error "RangeError: Invalid status code: undefined"
  const statusCode = err.status
  const isValidStatusCode =
    statusCode && Number.isInteger(statusCode) && statusCode >= 100 && statusCode < 600
  const status = isValidStatusCode ? statusCode : 500
  const message = err.message || errorMessageList[status] || 'Internal Server Error'

  res.status(status).json({ message })
})

app.listen(PORT, () => {
  connectToMongoDB()
  console.log(`server is listening on ${PORT}`)
})
