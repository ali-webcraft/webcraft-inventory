const Product = require('../models/product.model')

const findProductById = async (id) => {
 return await Product.findById(id)
}

module.exports = {
 findProductById
}