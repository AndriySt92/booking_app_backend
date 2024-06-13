import express from 'express'
import { loginValidation, registerValidation } from '../middlewares'
import { login, logout, register } from '../controllers/auth.controller'
import { ctrlWrapper } from '../utils'

const router = express.Router()

router.post('/register', registerValidation, ctrlWrapper(register))
router.post('/login', loginValidation, ctrlWrapper(login))
router.post('/logout', ctrlWrapper(logout))

export default router
