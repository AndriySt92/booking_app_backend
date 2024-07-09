import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { httpError } from '../utils'
import AuthService from '../services/auth.service'

export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    throw httpError({ status: 400, message: errors.array()[0].msg })
  }

  const registerData = req.body

  const result = await AuthService.register(registerData, res);

  res.status(result.status).json({
    message: result.message,
  })
}

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    throw httpError({ status: 400, message: errors.array()[0].msg })
  }

  const loginData = req.body

  const user = await AuthService.login(loginData, res)

  res.json(user)
}

export const validateToken = (req: Request, res: Response) => {
  res.status(200).send({ userId: req.user?._id })
}

export const current = async (req: Request, res: Response) => {
  res.json(req.user)
}

export const logout = (req: Request, res: Response): void => {
  res.cookie('auth_token', '', { maxAge: 0 })
  res.status(200).json({ message: 'Logged out successfully' })
}
