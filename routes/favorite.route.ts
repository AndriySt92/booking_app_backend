import express from 'express'
import { authenticate } from '../middlewares'
import { addFavorite, removeFavorite, getFavorites, getFavoriteHotelIds } from '../controllers/favorite.controller'
import { ctrlWrapper } from '../utils'

const router = express.Router()

router.post('/', authenticate as any, ctrlWrapper(addFavorite))
router.delete('/:hotelId', authenticate as any, ctrlWrapper(removeFavorite))
router.get('/', authenticate as any, ctrlWrapper(getFavorites))
router.get('/ids', authenticate as any, ctrlWrapper(getFavoriteHotelIds))

export default router
