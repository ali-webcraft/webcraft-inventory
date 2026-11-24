const cookieParser = require('cookie-parser')
const express = require('express');
const app = express();
const cors = require('cors')

const authRouter = require('./routes/auth.route')
const productRouter = require('./routes/product.route')
const errorHandler = require('./middlewares/error.middleware')
const logger = require('./middlewares/logger.middleware')
const connectDB = require('./config/db')

app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(cookieParser())

app.use(express.json());
app.use(logger)

// Live server ko jagaye rakhne aur check karne ke liye
app.get('/api/health', (req, res) => res.json({ ok: true }))

// Har request se pehle database connected hona chahiye (connect ek hi baar hota hai, phir cached)
app.use(async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (error) {
    next(error)
  }
})

app.use('/api/product', productRouter)
app.use('/api/auth', authRouter)
app.use(errorHandler)

module.exports = app