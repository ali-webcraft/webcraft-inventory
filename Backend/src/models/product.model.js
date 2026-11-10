const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required:true
  },
  price:{
   type:Number,
   required:true,
   min:0
  },
  stock:{
   type:Number,
   required:true,
   min:0,
   default : 0
  },
  category:{
   type:String,
   required:true,
  },
  description:{
   type:String,
  },
  imageUrl : {
    type : String,
    required : [true,"Product image is required"]
  },
  imageFileId : {
    type : String,
    required  :[true , "Image file id is required"]
  }

 })

 module.exports = mongoose.model('Product',productSchema)