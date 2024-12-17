import { Request, Response } from 'express'
import { v2 as cloudinary } from 'cloudinary'
import productModel from '../models/productModel'
// function for add product
const addProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body

    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    const image1 = files.image1 && files.image1[0]
    const image2 = files.image2 && files.image2[0]
    const image3 = files.image3 && files.image3[0]
    const image4 = files.image4 && files.image4[0]

    const images = [image1, image2, image3, image4].filter((item) => item != undefined)
    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' })
        return result.secure_url
      })
    )
    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      bestseller: bestseller === 'true' ? 'true' : 'false',
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now()
    }

    const product = new productModel(productData)

    await product.save()

    res.json({ success: true, message: 'Product added successfully!' })
  } catch (error) {
    const err = error as Error
    res.json({ success: false, message: err.message })
  }
}

// function for list product
const listProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await productModel.find({})
    res.json({ success: true, products })
  } catch (error) {
    const err = error as Error
    res.json({ success: false, message: err.message })
  }
}

// function for removing product
const removeProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    await productModel.findByIdAndDelete(req.body.id)
    res.json({ success: true, message: 'Product removed successfully!' })
  } catch (error) {
    const err = error as Error
    res.json({ success: false, message: err.message })
  }
}

// function for single product infor
const singleProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.body
    const product = await productModel.findById(productId)
    res.json({ success: true, product })
  } catch (error) {
    const err = error as Error
    res.json({ success: false, message: err.message })
  }
}

export { listProducts, addProduct, removeProducts, singleProducts }
