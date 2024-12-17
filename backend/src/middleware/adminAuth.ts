import { Request, Response, NextFunction } from 'express'
import { IncomingHttpHeaders } from 'http';
import jwt from 'jsonwebtoken'

type CustomHeaders = {
  token?: string
} & IncomingHttpHeaders

const adminAuth = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { token } = req.headers as CustomHeaders
    if (!token) {
      return res.json({ success: false, message: 'Not Authorized Login Again' })
    }
    const token_decode = jwt.verify(token, process.env.JWT_SECRET as string)
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL as string
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD as string
    if (token_decode !== ADMIN_EMAIL + ADMIN_PASSWORD) {
      return res.json({ success: false, message: 'Not Authorized Login Again' })
    }
    next()
  } catch (error) {
    const err = error as Error
    res.json({ success: false, message: err.message })
  }
}

export default adminAuth
