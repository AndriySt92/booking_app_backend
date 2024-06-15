import express from 'express'
import { authenticate, loginValidation, registerValidation } from '../middlewares'
import { current, login, logout, register, validateToken } from '../controllers/auth.controller'
import { ctrlWrapper } from '../utils'
import { IAuthRequest } from '../types/userTypes'

const router = express.Router()

router.post('/register', registerValidation, ctrlWrapper(register))
router.post('/login', loginValidation, ctrlWrapper(login))
router.get('/validate-token',authenticate as any, ctrlWrapper<IAuthRequest>(validateToken))
router.get('/current', authenticate as any, ctrlWrapper<IAuthRequest>(current))
router.post('/logout', authenticate as any, ctrlWrapper(logout))

export default router
