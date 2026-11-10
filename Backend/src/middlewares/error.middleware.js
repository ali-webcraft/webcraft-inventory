const errorHandler = (err, req, res, next) => {
 if (err.name === "CastError") {
  return res.status(400).json({ success: false, message: "Invalid Id" })
 }

 if (err.name === "ValidationError") {
  const messages = Object.values(err.errors).map(e => e.message)
  return res.status(400).json({ success: false, message: "Validation failed", errors: messages })
 }

 if(err.code === 'LIMIT_FILE_SIZE'){
  return res.status(400).json({success : false , message : "Image must be less than 2MB"})
 }

 if(err.message === 'Only images are allowed'){
  return res.status(400).json({success : false , message : "Only images are allowed"})
 }
 
 res.status(500).json({ success: false, message: err.message })

}

module.exports = errorHandler