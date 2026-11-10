const Product = require('../models/product.model')
const { uploadImage, deleteImage } = require('../config/imagekit')

const { findProductById } = require('../services/product.service')

const createProduct = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Product image is required!" })
    }

    const result = await uploadImage(req.file.buffer, req.file.originalname)
    const newProduct = new Product({ ...req.body, imageUrl: result.url, imageFileId: result.fileId })
    const savedProduct = await newProduct.save()

    res.status(201).json({
      success: true,
      message: "Product created successfully!",
      data: savedProduct
    })

  } catch (error) {
    console.error(error)
    next(error)
  }
}

const getAllProducts = async (req, res, next) => {
  try {
    // 1. FILTER: 
    const filter = {}
    if (req.query.category) {
      filter.category = req.query.category
    }
    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: 'i' }
    }

    // 2. PAGINATION:
    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10))
    const skip = (page - 1) * limit

    // 3. SORT:
    let sortBy = {}
    const sort = req.query.sort

    if (sort) {
      if (sort.startsWith('-')) {
        sortBy[sort.slice(1)] = -1
      } else {
        sortBy[sort] = 1
      }
    }

    // 4. TOTAL
    const total = await Product.countDocuments(filter)
    const totalPages = Math.ceil(total / limit)

    const products = await Product.find(filter).sort(sortBy).skip(skip).limit(limit)

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page,
      totalPages,
      data: products
    })
  } catch (error) {
    next(error)
  }
}

const getProductById = async (req, res, next) => {
  try {
    const product = await findProductById(req.params.id)
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }
    res.status(200).json({
      success: true,
      message: "Product found",
      data: product
    })
  } catch (error) {
    next(error)
  }
}

const updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct
    })
  } catch (error) {
    next(error)
  }
}

const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id
    const deletedProduct = await Product.findByIdAndDelete(id)
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }

    await deleteImage(deletedProduct.imageFileId)

    res.status(200).json({
      success: true,
      message: "Product deleted",
      data: deletedProduct
    })
  } catch (error) {
    next(error)
  }
}

const updateStock = async (req, res, next) => {
  try {
    const id = req.params.id
    const change = req.body.change
    if (typeof change !== 'number' || change === 0) {
      return res.status(400).json({ success: false, message: "change must be a non-zero number" })
    }

    if (change < 0) {
      const amount = -change

      const product = await Product.findOneAndUpdate(
        { _id: id, stock: { $gte: amount } },
        { $inc: { stock: change } },
        { new: true }

      )
      if (!product) {
        const exists = await Product.findById(id)
        if (!exists) {
          return res.status(404).json({ success: false, message: "Product not found" })
        }
        return res.status(400).json({ success: false, message: "Insufficient stock" })
      }
      return res.status(200).json({ success: true, data: product })

    }
    const product = await Product.findByIdAndUpdate(
      id, { $inc: { stock: change } },
      { new: true }
    )
    if (product === null) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }

    res.status(200).json({ success: true, data: product })
  } catch (error) {
    next(error)
  }
}
module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateStock
}