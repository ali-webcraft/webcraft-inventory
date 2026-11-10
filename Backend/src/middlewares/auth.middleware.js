const jwt = require('jsonwebtoken')

const protect = (req, res, next) => {
 try {
  let token = req.cookies.token
  const authHeader = req.headers.authorization
  if (!token && authHeader && authHeader.startsWith('Bearer ')) {
   token = authHeader.split(' ')[1]
  }
  if (!token) {
   return res.status(401).json({ success: false, message: 'Not authorized, token missing' })
  }
  const decode = jwt.verify(token, process.env.JWT_SECRET)
  req.user = decode
  next()
 } catch {
  return res.status(401).json({ success: false, message: 'Invalid or expired token' })
 }
}

const adminOnly = (req, res, next) => {
 if (req.user.role !== 'admin') {
  return res.status(403).json({ success: false, message: 'Access denied, admin only' })
 }
 next()
}
module.exports = { protect, adminOnly }