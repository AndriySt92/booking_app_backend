import express from 'express'
import { authenticate, upload } from '../middlewares'
import { ctrlWrapper } from '../utils'
import {
  createMyHotel,
  getMyHotels,
  updateMyHotel,
  getMyHotelById,
  deleteMyHotel,
} from '../controllers/my-hotel.controller'

const router = express.Router()

router.post('/', authenticate as any, upload.array('imageFiles', 6), ctrlWrapper(createMyHotel))
router.get('/', authenticate as any, ctrlWrapper(getMyHotels))
router.get('/:id', authenticate as any, ctrlWrapper(getMyHotelById))
router.put('/:id', authenticate as any, upload.array('imageFiles', 6), ctrlWrapper(updateMyHotel))
router.delete('/:id', authenticate as any, ctrlWrapper(deleteMyHotel));


export default router
