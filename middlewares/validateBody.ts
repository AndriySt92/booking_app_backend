import { check } from 'express-validator'

export const loginValidation = [
  check('email', 'Enter a valid email address').isEmail(),
  check('password', 'Password should contain at least six characters').isLength({ min: 6 }),
]

export const registerValidation = [
  check('firstName', 'FirstName should contain at least two letters').isLength({ min: 2 }),
  check('lastName', 'LastName should contain at least two letters').isLength({ min: 2 }),
  check('email', 'Email address is invalid').isEmail(),
  check('password', 'Password should contain at least six characters').isLength({
    min: 6,
  }),
]

export const createHotelValidation = [
  check('name', 'Name should contain at least two letters').isLength({ min: 2 }),
  check('city', 'City is required').notEmpty(),
  check('country', 'Country is required').notEmpty(),
  check('description', 'Description is required').notEmpty(),
  check('type').notEmpty().withMessage('Hotel type is required'),
  check('pricePerNight', 'Price per night is required and must be a number').notEmpty().isNumeric(),
  check('facilities', 'Facilities are required').notEmpty().isArray(),
]
