import express from 'express'
import { authenticate, upload } from '../middlewares'
import { ctrlWrapper } from '../utils'
import {
  createHotel,
  getMyHotels,
  updateMyHotel,
  getMyHotelById,
  deleteHotel,
} from '../controllers/my-hotel.controller'

const router = express.Router()

router.post('/', authenticate as any, upload.array('imageFiles', 6), ctrlWrapper(createHotel))
router.get('/', authenticate as any, ctrlWrapper(getMyHotels))
router.get('/:id', authenticate as any, ctrlWrapper(getMyHotelById))
router.put('/:id', authenticate as any, upload.array('imageFiles', 6), ctrlWrapper(updateMyHotel))
router.delete('/:id', authenticate as any, ctrlWrapper(deleteHotel));


export default router
