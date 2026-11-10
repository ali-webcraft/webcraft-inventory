const cookieParser = require('cookie-parser')
const express = require('express');
const app = express();
const cors = require('cors')

const authRouter = require('./routes/auth.route')
const productRouter = require('./routes/product.route')
const errorHandler = require('./middlewares/error.middleware')
const logger = require('./middlewares/logger.middleware')

app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(cookieParser())

app.use(express.json());
app.use(logger)
app.use('/api/product', productRouter)
app.use('/api/auth', authRouter)
app.use(errorHandler)

module.exports = app