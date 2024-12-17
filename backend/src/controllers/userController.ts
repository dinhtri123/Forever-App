import { Request, Response } from 'express'
import userModel from '../models/userModel'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const createToken = (id: string) => {
  // jwt.sign -> tạo mã JWT được kí hiệu = chuỗi bí mật
  return jwt.sign({ id }, process.env.JWT_SECRET as string)
}

// route for use login
const loginUser = async (req: Request, res: Response) : Promise<any> => {
  try {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.json({ success: false, message: "User don't exits" })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
      const token = createToken(user._id)
      res.json({ success: true, token })
    } else {
      res.json({ success: false, message: 'Invalid credentials' })
    }
  } catch (error) {
    const err = error as Error
    console.log(error)
    res.json({ success: false, message: err.message })
  }
}

// Rotue for use register
const registerUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password } = req.body
    // checking user already exits or not
    const exits = await userModel.findOne({ email })
    if (exits) {
      return res.json({ success: false, message: 'User already exits' })
    }
    // validating email format $ strong password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Please enter a valid email' })
    }
    if (password.length < 8) {
      return res.json({ success: false, message: 'Please enter a strong password' })
    }
    // hasing user password
    const salt = await bcrypt.genSalt() // tạo ký tự ngẫu nhiên
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword
    })
    const user = await newUser.save()
    const token = createToken(user._id)
    res.json({ success: true, token })
  } catch (error) {
    const err = error as Error
    console.log(error)
    res.json({ success: false, message: err.message })
  }
}

// Route for admin login
const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET as string)
      res.json({ success: true, token })
    } else {
      res.json({ success: false, message: 'Invalid credentials' })
    }
  } catch (error) {
    const err = error as Error
    res.json({ success: false, message: err.message })
  }
}

export { loginUser, registerUser, adminLogin }
