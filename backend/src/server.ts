import express, { Request, Response } from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb'
import connectCloundinary from './config/cloundinary'
import userRouter from './routes/userRoute'
import productRouter from './routes/productRouter'
import cartRouter from './routes/cartRoute'

// API Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloundinary()

// Middleware
app.use(express.json())
app.use(cors())

// API endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)

app.get('/', (req: Request, res: Response) => {
  res.send('API Working')
})

// Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
