import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const authUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { token } = req.headers
  if (!token || Array.isArray(token)) {
    return res.json({ success: false, message: 'Not Authorized Login Again' })
  }
  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string }
    req.body.userId = token_decode.id
    next()
  } catch (error) {
    const err = error as Error
    res.json({ success: false, message: err.message })
  }
}

export default authUser
