import { NextFunction, Response, Request } from 'express'

export const ctrlWrapper =
  <T = Request>(ctrl: (req: T, res: Response, next: NextFunction) => void) =>
  async (req: T, res: Response, next: NextFunction) => {
    try {
      await ctrl(req, res, next)
    } catch (error) {
      next(error)
    }
  }
