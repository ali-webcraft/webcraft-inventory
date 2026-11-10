const User = require('../models/auth.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req, res, next) => {
 try {
  const { name, email, password } = req.body
  const findUser = await User.findOne({ email })
  if (findUser) {
   return res.status(409).json({ success: false, message: "Email already registered" })
  }
  const hashed = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, password: hashed })
  res.status(201).json({
   success: true,
   data: { _id: user._id, name: user.name, email: user.email, role: user.role }
  })
 } catch (error) {
  next(error)
 }
}

const login = async (req, res, next) => {
 try {
  const { email, password } = req.body
  if (!email || !password) {
   return res.status(400).json({ success: false, message: "Email and password are required" })
  }
  const findRegister = await User.findOne({ email })
  if (!findRegister) {
   return res.status(401).json({ success: false, message: "Invalid email or password" })
  }
  const ok = await bcrypt.compare(password, findRegister.password)
  if (!ok) {
   return res.status(401).json({ success: false, message: "Invalid email or password" })
  }
  const token = jwt.sign(
   { id: findRegister.id, role: findRegister.role },
   process.env.JWT_SECRET,
   { expiresIn: '1d' }
  )

  res.cookie('token', token, {
   httpOnly: true,
   secure: false,
   sameSite: 'lax',
   maxAge: (24 * 60 * 60 * 1000)
  })

  return res.status(200).json({
   success: true,
   // token,
   data: { _id: findRegister._id, name: findRegister.name, email: findRegister.email, role: findRegister.role }
  })
 } catch (error) {
  next(error)
 }
}

const getMe = async (req, res, next) => {
 try {
  const id = req.user.id
  const findUser = await User.findById(id).select('-password')
  if (!findUser) {
   return res.status(404).json({ success: false, message: "User not found" })
  }
  return res.status(200).json({ success: true, data: findUser })
 } catch (error) {
  next(error)
 }
}

const logout = (req, res) => {
 res.clearCookie('token', {
  httpOnly: true,
  secure: false,
  sameSite: 'lax'
 })
 res.status(200).json({ success: true, message: "Logged out successfully" })
}

module.exports = { register, login, getMe, logout }