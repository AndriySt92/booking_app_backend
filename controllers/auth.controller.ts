import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import User from '../models/user.model'
import { httpError } from '../utils'
import { generateTokenAndSetCookie } from '../utils'
import { IAuthRequest, IRequest } from '../types/userTypes'

export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    throw httpError({ status: 400, message: errors.array()[0].msg })
  }

  const { email } = req.body
  const user = await User.findOne({ email })

  if (user) {
    throw httpError({ status: 409, message: 'Email already use' })
  }

  const newUser = await User.create({
    ...req.body,
  })

  generateTokenAndSetCookie({ userId: newUser._id, res })

  res.status(201).json({
    message: 'User created successfully!',
  })
}

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    throw httpError({ status: 400, message: errors.array()[0].msg })
  }

  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    throw httpError({ status: 400, message: 'Invalid username or password' })
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password)

  if (!isPasswordCorrect) {
    throw httpError({ status: 400, message: 'Invalid username or password' })
  }

  generateTokenAndSetCookie({ userId: user._id, res })

  res.status(200).json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  })
}

export const validateToken = (req: IAuthRequest, res: Response) => {
  res.status(200).send({ userId: req.user?._id })
}

export const current = async (req: IAuthRequest, res: Response) => {
  res.json(req.user)
}

export const logout = (req: Request, res: Response): void => {
  res.cookie('auth_token', '', { maxAge: 0 })
  res.status(200).json({ message: 'Logged out successfully' })
}
