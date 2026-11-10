const express = require('express')
const authRouter = express.Router()
const { register, login, getMe, logout } = require('../controllers/auth.controller')
const { protect } = require('../middlewares/auth.middleware')
const validate = require('../middlewares/validate.middleware')
const { registerSchema } = require('../validators/auth.validator')

authRouter.post('/register', validate(registerSchema), register)
authRouter.post('/login', login)
authRouter.get('/me', protect, getMe)
authRouter.post('/logout', logout)

module.exports = authRouter