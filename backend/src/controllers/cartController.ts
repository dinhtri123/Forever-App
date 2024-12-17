import { Request, Response } from 'express'
import userModel from '../models/userModel'
// add products to user cart
const addToCart = async (req: Request, res: Response) => {
  try {
    const { userId, itemId, size } = req.body
    const userData = await userModel.findById(userId)
    const cartData = await userData.cartData
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1
      } else {
        cartData[itemId][size] = 1
      }
    } else {
      cartData[itemId] = {}
      cartData[itemId][size] = 1
    }
    await userModel.findByIdAndUpdate(userId, { cartData })
    res.json({ sucess: true, message: 'Added to Cart' })
  } catch (error) {
    const err = error as Error
    res.json({ success: false, message: err.message })
  }
}

// update products to user cart
const updateCart = async (req: Request, res: Response) => {
  try {
    const { userId, itemId, size, quantity } = req.body
    const userData = await userModel.findById(userId)
    const cartData = await userData.cartData
    // check data if quality = 0
    if (quantity == 0) {
      delete cartData[itemId][size]
      if (Object.keys(cartData[itemId]).length == 0) {
        delete cartData[itemId]
      }
    } else {
      cartData[itemId][size] = quantity
    }
    await userData.save()
    res.json({ sucess: true, message: 'Cart Updated', cartData: cartData })
  } catch (error) {
    const err = error as Error
    res.json({ success: false, message: err.message })
  }
}

// get use cart data
const getUserCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body
    const userData = await userModel.findById(userId)
    const cartData = await userData.cartData
    res.json({ success: true, cartData })
  } catch (error) {
    const err = error as Error
    res.json({ success: false, message: err.message })
  }
}

export { addToCart, updateCart, getUserCart }
