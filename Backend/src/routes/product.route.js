const express = require('express')
const productRouter = express.Router();

const {
 createProduct,
 getAllProducts,
 getProductById,
 updateProduct,
 deleteProduct,
 updateStock
} = require('../controllers/product.controller')

const { protect, adminOnly } = require('../middlewares/auth.middleware')

const uploads = require('../middlewares/upload.middleware')
const validate = require('../middlewares/validate.middleware')
const { createProductSchema, updateProductSchema } = require('../validators/product.validator')

productRouter.post('/', protect, adminOnly, uploads.single('image'), validate(createProductSchema), createProduct)
productRouter.get('/', getAllProducts)
productRouter.get('/:id', getProductById)
productRouter.put('/:id', protect, adminOnly, validate(updateProductSchema), updateProduct)
productRouter.delete('/:id', protect, adminOnly, deleteProduct)
productRouter.patch('/:id/stock', protect, adminOnly, updateStock)


module.exports = productRouter