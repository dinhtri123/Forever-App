import express from 'express'
import { listProducts, addProduct, removeProducts, singleProducts } from '../controllers/productController'
import upload from '../middleware/multer'
import adminAuth from '../middleware/adminAuth'

const productRouter = express.Router()

productRouter.post(
  '/add-product',
  adminAuth,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
  ]),
  addProduct
)
productRouter.post('/remove-product', adminAuth, removeProducts)
productRouter.post('/single-product', singleProducts)
productRouter.get('/list-product', listProducts)

export default productRouter
