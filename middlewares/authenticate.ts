import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user.model'
import { IDecodedToken, IRequest } from '../types/userTypes'
import { httpError } from '../utils'

export const authenticate = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies['auth_token']

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - No Token Provided' })
    }

    const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as IDecodedToken

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized - Invalid Token' })
    }

    const user = await User.findById(userId as string).select('-password')

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    req.user = user

    next()
  } catch (error) {
    if (error instanceof Error) {
      console.log('Error in authenticate middleware: ', error.message)
      throw httpError({ status: 401, message: error.message })
    }
  }
}
