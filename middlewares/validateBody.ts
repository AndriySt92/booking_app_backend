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
